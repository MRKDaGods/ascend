import startSharedService from "@shared/sharedService";
import companyRoutes from "./routes/companyRoutes";
import { consumeEvents, getQueueName, getRPCQueueName, setupRPCServer } from "@shared/rabbitMQ";
import { Events } from "@shared/rabbitMQ";
import { handleGetCompanyFollowers, handleGetCompanyProfile } from "./consumers/companyConsumers";
import { Services } from "@ascend/shared";

startSharedService(Services.COMPANY, companyRoutes, {
    postMQInit : async () => {
        await setupRPCServer(getQueueName(Events.GET_COMPANY_PROFILE), handleGetCompanyProfile);
        await setupRPCServer(getQueueName(Events.GET_COMPANY_FOLLOWERS), handleGetCompanyFollowers);
    }
})