import startSharedService from "@shared/sharedService";
import emailRoutes from "./routes/emailRoutes";
import { consumeEvents, Events, getQueueName } from "@shared/rabbitMQ";
import { handleSendEmail } from "./consumers/emailConsumer";
import { ensureSystemUserExists } from "./services/emailService";

startSharedService("Email", emailRoutes, {
  registerConsumers: [
    async () => {
      // Register the email send consumer
      await consumeEvents(
        getQueueName(Events.EMAIL_SEND),
        Events.EMAIL_SEND,
        handleSendEmail
      );
    },
  ],
  customInit: async (_) => {
    // Ensure admin user exists
    await ensureSystemUserExists();
  },
});
