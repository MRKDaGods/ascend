import startSharedService from "@shared/sharedService";
import companyRoutes from "./routes/companyRoutes";
import { consumeEvents, setupRPCServer } from "@shared/rabbitMQ";
import { events } from "@shared/rabbitMQ";
import { handleGetCompanyFollowers, handleIsCompanyCreator } from "./consumers/companyConsumers";

startSharedService("Auth", companyRoutes, {
    postMQInit : async () => {
        await setupRPCServer(events.IS_COMPANY_CREATOR, handleIsCompanyCreator);
        await setupRPCServer(events.GET_COMPANY_FOLLOWERS, handleGetCompanyFollowers);
    }
})