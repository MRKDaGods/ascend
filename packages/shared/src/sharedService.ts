// Common service implementation for all modules

import express, { Router } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { closeRabbitMQ, connectRabbitMQ } from "./rabbitMQ/mq";

// Load environment variables
dotenv.config();
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
const startSharedService = async (
  name: string,
  routes?: Router,
  options?: {
    dontConnectRabbitMQ?: boolean;
    registerConsumers?: Array<() => Promise<void>>;
    customInit?: (app: express.Express) => Promise<void>;
    postMQInit?: () => Promise<void>;
  }
) => {
  console.log(`Starting ${name} Service`);

  // Setup express
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Custom initialization
  if (options?.customInit) {
    await options.customInit(app);
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
      await connectRabbitMQ();

      // Register consumers if provided
      if (options?.registerConsumers) {
        console.log(
          `Registering ${options.registerConsumers.length} consumer(s)`
        );
        for (const registerConsumer of options.registerConsumers) {
          await registerConsumer();
        }
      }

      // Post RabbitMQ initialization
      if (options?.postMQInit) {
        await options.postMQInit();
      }
    }

    // Begin listening
    app.listen(PORT, () =>
      console.log(`${name} Service running on port ${PORT}`)
    );
  } catch (error) {
    console.error(`Failed to start ${name} Service:`, error);
    process.exit(1);
  }

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Closing server...");

    // Safely close RabbitMQ connection
    if (connectToRabbitMQ) {
      await closeRabbitMQ();
    }

    process.exit(0);
  });
};

export default startSharedService;
