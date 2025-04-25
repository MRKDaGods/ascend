import startSharedService from "@shared/sharedService";
import companyRoutes from "./routes/companyRoutes";
import { consumeEvents, setupRPCServer } from "@shared/rabbitMQ";
import { Events } from "@shared/rabbitMQ";
import { handleGetCompanyFollowers, handleGetCompanyProfile } from "./consumers/companyConsumers";

startSharedService("Auth", companyRoutes, {
    postMQInit : async () => {
        await setupRPCServer(Events.GET_COMPANY_PROFILE, handleGetCompanyProfile);
        await setupRPCServer(Events.GET_COMPANY_FOLLOWERS, handleGetCompanyFollowers);
    }
})