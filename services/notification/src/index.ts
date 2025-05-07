import { consumeEvents, Events, getQueueName } from "@shared/rabbitMQ";
import startSharedService from "@shared/sharedService";
import {
  handleSendNotification,
  handleUserCreated,
} from "./consumers/notificationConsumer";
import notificationRoutes from "./routes/notificationRoutes";

startSharedService("Notification", notificationRoutes, {
  registerConsumers: [
    async () => {
      // Register the user created consumer
      await consumeEvents(
        getQueueName(Events.USER_CREATED),
        Events.USER_CREATED,
        handleUserCreated
      );

      // Register the send notification consumer
      await consumeEvents(
        getQueueName(Events.NOTIFICATION_SEND),
        Events.NOTIFICATION_SEND,
        handleSendNotification
      );
    },
  ],
});
