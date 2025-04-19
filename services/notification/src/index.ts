import { consumeEvents, Events, getQueueName } from "@shared/rabbitMQ";
import startSharedService from "@shared/sharedService";
import { handleUserCreated } from "./consumers/notificationConsumer";
import notificationRoutes from "./routes/notificationRoutes";
import { sendWelcomeNotification } from "./services/notificationService";

startSharedService("Notification", notificationRoutes, {
  registerConsumers: [
    async () => {
      // Register the user created consumer
      await consumeEvents(
        getQueueName(Events.USER_CREATED),
        Events.USER_CREATED,
        handleUserCreated
      );
    },
  ],
});
