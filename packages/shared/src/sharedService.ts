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
 * @param options.registerConsumers - An array of functions to register as consumers
 */
const startSharedService = async (
  name: string,
  routes: Router,
  options?: {
    registerConsumers?: Array<() => Promise<void>>;
  }
) => {
  console.log(`Starting ${name} Service`);

  // Setup express
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Register controller
  app.use("/", routes);

  // Start server
  try {
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
    await closeRabbitMQ();
    process.exit(0);
  });
};

export default startSharedService;
