import {
  consumeEvents,
  Events,
  getQueueName,
  setupRPCServer,
} from "@shared/rabbitMQ";
import startSharedService from "@shared/sharedService";
import {
  handleFileDelete,
  handleFileUploadRPC,
  handleGetPresignedUrlRPC,
} from "./consumers/fileConsumer";
import fileRoutes from "./routes/fileRoutes";
import { initMinIO } from "./services/fileUploadService";

startSharedService("File", fileRoutes, {
  registerConsumers: [
    async () => {
      // Register the file delete consumer
      await consumeEvents(
        getQueueName(Events.FILE_DELETE),
        Events.FILE_DELETE,
        handleFileDelete
      );
    },
  ],
  customInit: async (_) => {
    // Initialize MinIO
    await initMinIO();
  },
  postMQInit: async () => {
    // Setup RPC server for pre-signed URLs
    await setupRPCServer(getQueueName(Events.FILE_URL_RPC), handleGetPresignedUrlRPC);

    // Setup RPC server for file uploads
    // Transferring files through the broker isnt really recommended
    // but we have a 5mb limit, so we're fine
    await setupRPCServer(getQueueName(Events.FILE_UPLOAD_RPC), handleFileUploadRPC);
  },
});
