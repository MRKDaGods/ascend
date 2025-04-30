import startSharedService from "@shared/sharedService";
import postRoutes from "./routes/postRoutes";
import { Events, getQueueName, setupRPCServer } from "@shared/rabbitMQ";
import { handleGetPostRequestRPC } from "./consumers/postConsumer";
startSharedService("Post", postRoutes, {
  postMQInit: async () => {
    // Setup RPC server for get_post_rpc
    await setupRPCServer(
      getQueueName(Events.POST_GET_RPC),
      handleGetPostRequestRPC
    );
  },
});
