"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRabbitMQ = exports.callRPC = exports.setupRPCServer = exports.consumeEvents = exports.publishEvent = exports.connectRabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
let connection = null;
let channel = null;
const EXCHANGE = "system.events";
const RABBITMQ_URL = process.env.RABBITMQ_URL;
const connectWithRetry = (url_1, ...args_1) => __awaiter(void 0, [url_1, ...args_1], void 0, function* (url, retries = 12, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            const conn = yield amqplib_1.default.connect(url);
            return conn;
        }
        catch (error) {
            console.error(`Failed to connect to RabbitMQ (attempt ${i + 1}/${retries}):`, error);
            if (i === retries - 1) {
                throw error;
            }
            // Try again
            yield new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw new Error("Failed to connect to RabbitMQ after maximum retries");
});
const connectRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!RABBITMQ_URL) {
            throw new Error("RABBITMQ_URL is not defined");
        }
        connection = yield connectWithRetry(RABBITMQ_URL);
        channel = yield connection.createChannel();
        // Declare exchange
        yield channel.assertExchange(EXCHANGE, "topic", {
            durable: true,
        });
        console.log("Connected to RabbitMQ");
    }
    catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        throw error;
    }
});
exports.connectRabbitMQ = connectRabbitMQ;
const checkChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }
};
// Publish an event
const publishEvent = (routingKey, message) => __awaiter(void 0, void 0, void 0, function* () {
    checkChannel();
    const msg = JSON.stringify(message);
    channel.publish(EXCHANGE, routingKey, Buffer.from(msg), {
        persistent: true,
    });
    console.log(`Published event: ${routingKey}`, message);
});
exports.publishEvent = publishEvent;
// Consume events
const consumeEvents = (queue, routingKey, handler) => __awaiter(void 0, void 0, void 0, function* () {
    checkChannel();
    yield channel.assertQueue(queue, { durable: true });
    yield channel.bindQueue(queue, EXCHANGE, routingKey);
    // One msg processed at a time per consumer
    yield channel.prefetch(1);
    channel.consume(queue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        if (msg) {
            try {
                // Parse and handle the message
                const payload = JSON.parse(msg.content.toString());
                yield handler(payload);
                channel.ack(msg);
            }
            catch (error) {
                console.error("Error processing message:", error);
                channel.nack(msg, false, true); // Requeue the message
            }
        }
    }), { noAck: false } // Ensure that messages are acknowledged
    );
    console.log(`Consuming messages from queue: ${queue} with routing key: ${routingKey}`);
});
exports.consumeEvents = consumeEvents;
// Setup an RPC server
const setupRPCServer = (queue, handler) => __awaiter(void 0, void 0, void 0, function* () {
    checkChannel();
    console.log(`Setting up RPC server for queue: ${queue}`);
    yield channel.assertQueue(queue, { durable: false });
    yield channel.prefetch(1);
    channel.consume(queue, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        if (msg) {
            const message = JSON.parse(msg.content.toString());
            const correlationId = msg.properties.correlationId;
            const replyTo = msg.properties.replyTo;
            try {
                const response = yield handler(message);
                const responseBuffer = Buffer.from(JSON.stringify(response));
                channel.sendToQueue(replyTo, responseBuffer, { correlationId });
            }
            catch (error) {
                console.log(`Error occurred while processing rpc call: ${error}`);
                const errorResponse = {
                    error: error.message || "Server error",
                };
                const responseBuffer = Buffer.from(JSON.stringify(errorResponse));
                channel.sendToQueue(replyTo, responseBuffer, { correlationId });
            }
            channel.ack(msg);
        }
    }));
});
exports.setupRPCServer = setupRPCServer;
// Generic RPC call
const callRPC = (queue_1, message_1, ...args_1) => __awaiter(void 0, [queue_1, message_1, ...args_1], void 0, function* (queue, message, timeoutMs = 30000 // 30s
) {
    checkChannel();
    // Generate a unique correlation ID
    const correlationId = Math.random().toString(36).substring(2, 15);
    // Setup a temporary queue to receive the response
    const replyQueue = yield channel.assertQueue("", { exclusive: true });
    return new Promise((resolve, reject) => {
        // Begin timeout
        const timeout = setTimeout(() => {
            reject(new Error(`RPC request timed out after ${timeoutMs}ms, queue: ${queue}`));
        }, timeoutMs);
        channel.consume(replyQueue.queue, (msg) => {
            if (msg && msg.properties.correlationId === correlationId) {
                // Clear the timeout
                clearTimeout(timeout);
                // Parse and respond
                const response = JSON.parse(msg.content.toString());
                if (response && response.error) {
                    reject(new Error(response.error));
                }
                else {
                    resolve(response);
                }
            }
        }, { noAck: true });
        const messageBuffer = Buffer.from(JSON.stringify(message));
        channel.sendToQueue(queue, messageBuffer, {
            correlationId,
            replyTo: replyQueue.queue,
        });
    });
});
exports.callRPC = callRPC;
// Close RabbitMQ connection
const closeRabbitMQ = () => __awaiter(void 0, void 0, void 0, function* () {
    if (channel)
        yield channel.close();
    if (connection)
        yield connection.close();
});
exports.closeRabbitMQ = closeRabbitMQ;
