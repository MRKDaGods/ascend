import { consumeEvents, events, getQueueName } from "@shared/rabbitMQ";
import startSharedService from "@shared/sharedService";
import { handleFileDeleted } from "./consumers/fileConsumer";
import fileRoutes from "./routes/fileRoutes";
import { initMinIO } from "./services/fileUploadService";

startSharedService("File", fileRoutes, {
  registerConsumers: [
    async () => {
      // Register the file deleted consumer
      await consumeEvents(
        getQueueName(events.FILE_DELETED),
        events.FILE_DELETED,
        handleFileDeleted
      );
    },
  ],
  customInit: async (_) => {
    // Initialize MinIO
    await initMinIO();
  },
});
