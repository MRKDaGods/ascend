import { Events, getQueueName, setupRPCServer } from "@shared/rabbitMQ";
import startSharedService from "@shared/sharedService";
import { handleGetAdminUserRPC, handleGetUserFCMTokenRPC } from "./consumers/authConsumer";
import authRoutes from "./routes/authRoutes";
import { createAdminUser } from "./services/userService";

startSharedService("Auth", authRoutes, {
  postMQInit: async () => {
    // Setup RPC server for user FCM token requests
    await setupRPCServer(
      getQueueName(Events.AUTH_FCM_TOKEN_RPC),
      handleGetUserFCMTokenRPC
    );

    // Setup RPC server for admin user requests
    await setupRPCServer(
      getQueueName(Events.AUTH_GET_ADMIN_RPC),
      handleGetAdminUserRPC
    );

    // Create admin user if it doesn't exist
    await createAdminUser();
  },
});
