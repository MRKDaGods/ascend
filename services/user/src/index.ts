import startSharedService from "@shared/sharedService";
import userRoutes from "./routes/userRoutes";
import { consumeEvents, events, getQueueName } from "@shared/rabbitMQ";
import { handleUserCreated } from "./consumers/userConsumer";

startSharedService("User", userRoutes, {
  registerConsumers: [
    async () => {
      // Register the user created consumer
      await consumeEvents(
        getQueueName(events.USER_CREATED),
        events.USER_CREATED,
        handleUserCreated
      );
    },
  ],
});
