import amqp, { Channel, ChannelModel, ConsumeMessage } from "amqplib";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

const EXCHANGE = "system.events";
const RABBITMQ_URL = process.env.RABBITMQ_URL;

const connectWithRetry = async (
  url: string,
  retries = 5,
  delay = 5000
): Promise<ChannelModel> => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await amqp.connect(url);
      return conn;
    } catch (error) {
      console.error(
        `Failed to connect to RabbitMQ (attempt ${i + 1}/${retries}):`,
        error
      );

      if (i === retries - 1) {
        throw error;
      }

      // Try again
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Failed to connect to RabbitMQ after maximum retries");
};

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    if (!RABBITMQ_URL) {
      throw new Error("RABBITMQ_URL is not defined");
    }

    connection = await connectWithRetry(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Declare exchange
    await channel.assertExchange(EXCHANGE, "topic", {
      durable: true,
    });

    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

const checkChannel = (): void => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
};

// Publish an event
export const publishEvent = async (
  routingKey: string,
  message: any
): Promise<void> => {
  checkChannel();

  const msg = JSON.stringify(message);
  channel!.publish(EXCHANGE, routingKey, Buffer.from(msg), {
    persistent: true,
  });

  console.log(`Published event: ${routingKey}`, message);
};

// Consume events
export const consumeEvents = async (
  queue: string,
  routingKey: string,
  handler: (msg: ConsumeMessage) => Promise<void>
): Promise<void> => {
  checkChannel();

  await channel!.assertQueue(queue, { durable: true });
  await channel!.bindQueue(queue, EXCHANGE, routingKey);

  // One msg processed at a time per consumer
  await channel!.prefetch(1);

  channel!.consume(
    queue,
    async (msg) => {
      if (msg) {
        try {
          await handler(msg);
          channel!.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);
          channel!.nack(msg, false, true); // Requeue the message
        }
      }
    },
    { noAck: false } // Ensure that messages are acknowledged
  );

  console.log(
    `Consuming messages from queue: ${queue} with routing key: ${routingKey}`
  );
};

// Setup an RPC server
export const setupRPCServer = async (
  queue: string,
  handler: (msg: any) => Promise<any>
): Promise<void> => {
  checkChannel();

  await channel!.assertQueue(queue, { durable: false });
  await channel!.prefetch(1);

  channel!.consume(queue, async (msg) => {
    if (msg) {
      const message = JSON.parse(msg.content.toString());
      const correlationId = msg.properties.correlationId;
      const replyTo = msg.properties.replyTo;

      try {
        const response = await handler(message);
        const responseBuffer = Buffer.from(JSON.stringify(response));
        channel!.sendToQueue(replyTo, responseBuffer, { correlationId });
      } catch (error) {
        console.log(`Error occurred while processing rpc call: ${error}`);
        const errorResponse = {
          error: (error as Error).message || "Server error",
        };
        const responseBuffer = Buffer.from(JSON.stringify(errorResponse));
        channel!.sendToQueue(replyTo, responseBuffer, { correlationId });
      }

      channel!.ack(msg);
    }
  });
};

// Generic RPC call
export const callRPC = async <T>(
  queue: string,
  message: any,
  timeoutMs: number = 30000 // 30s
): Promise<T> => {
  checkChannel();
  
  // Generate a unique correlation ID
  const correlationId = Math.random().toString(36).substring(2, 15);

  // Setup a temporary queue to receive the response
  const replyQueue = await channel!.assertQueue("", { exclusive: true });

  return new Promise((resolve, reject) => {
    // Begin timeout
    const timeout = setTimeout(() => {
      reject(new Error(`RPC request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    channel!.consume(
      replyQueue.queue,
      (msg) => {
        if (msg && msg.properties.correlationId === correlationId) {
          // Clear the timeout
          clearTimeout(timeout);

          // Parse and respond
          const response: any = JSON.parse(msg.content.toString());
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response as T);
          }
        }
      },
      { noAck: true }
    );

    const messageBuffer = Buffer.from(JSON.stringify(message));
    channel!.sendToQueue(queue, messageBuffer, {
      correlationId,
      replyTo: replyQueue.queue,
    });
  });
};

// Close RabbitMQ connection
export const closeRabbitMQ = async (): Promise<void> => {
  if (channel) await channel.close();
  if (connection) await connection.close();
};
