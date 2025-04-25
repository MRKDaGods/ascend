import startSharedService from "@shared/sharedService";
import userRoutes from "./routes/userRoutes";
import {
  consumeEvents,
  Events,
  getQueueName,
  setupRPCServer,
} from "@shared/rabbitMQ";
import {
  handleGetUserProfileRequestRPC,
  handleUserCreated,
  handleUserProfilePicRequestRPC,
} from "./consumers/userConsumer";

startSharedService("User", userRoutes, {
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

  postMQInit: async () => {
    // Setup RPC server for profile picture requests
    await setupRPCServer(
      getQueueName(Events.USER_PROFILE_PIC_RPC),
      handleUserProfilePicRequestRPC
    );

    // Setup RPC server for profile requests
    await setupRPCServer(
      getQueueName(Events.USER_PROFILE_RPC),
      handleGetUserProfileRequestRPC
    );
  },
});
