import startSharedService from "@shared/sharedService";
import paymentRoutes from "./routers/paymentRouter";
import { setupRPCServer } from "@shared/rabbitMQ";
import { Events } from "@shared/rabbitMQ";
import { handleGetUserUsage } from "./consumers/paymentConsumers";

startSharedService("payment", paymentRoutes, {
    postMQInit : async() => {
        await setupRPCServer(Events.GET_USER_USAGE , handleGetUserUsage);
    }
})