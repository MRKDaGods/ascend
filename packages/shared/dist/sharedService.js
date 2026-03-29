"use strict";
// Common service implementation for all modules
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mq_1 = require("./rabbitMQ/mq");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT;
/**
 * Starts a shared service with the given name and routes
 * and connects to RabbitMQ
 *
 * @param name - The name of the service
 * @param routes - The routes to register with the service
 * @param options - Additional options for the service
 * @param options.dontConnectRabbitMQ - If true, the service will not connect to RabbitMQ
 * @param options.registerConsumers - An array of functions to register as consumers
 * @param options.customInit - A custom initialization function for the service
 * @param options.postMQInit - A function to run after connecting to RabbitMQ
 *
 * @remarks
 * Any changes made here must be backwards compatible with the existing services
 */
const startSharedService = (name, routes, options) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Starting ${name} Service`);
    // Setup express
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Custom initialization
    if (options === null || options === void 0 ? void 0 : options.customInit) {
        yield options.customInit(app);
    }
    // Register controller
    if (routes) {
        app.use("/", routes);
    }
    // Start server
    const connectToRabbitMQ = !options || !options.dontConnectRabbitMQ;
    try {
        if (connectToRabbitMQ) {
            // Connect to RabbitMQ
            yield (0, mq_1.connectRabbitMQ)();
            // Register consumers if provided
            if (options === null || options === void 0 ? void 0 : options.registerConsumers) {
                console.log(`Registering ${options.registerConsumers.length} consumer(s)`);
                for (const registerConsumer of options.registerConsumers) {
                    yield registerConsumer();
                }
            }
            // Post RabbitMQ initialization
            if (options === null || options === void 0 ? void 0 : options.postMQInit) {
                yield options.postMQInit();
            }
        }
        // Begin listening
        app.listen(PORT, () => console.log(`${name} Service running on port ${PORT}`));
    }
    catch (error) {
        console.error(`Failed to start ${name} Service:`, error);
        process.exit(1);
    }
    // Graceful shutdown
    process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("SIGTERM received. Closing server...");
        // Safely close RabbitMQ connection
        if (connectToRabbitMQ) {
            yield (0, mq_1.closeRabbitMQ)();
        }
        process.exit(0);
    }));
});
exports.default = startSharedService;
