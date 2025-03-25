import startSharedService from "@shared/sharedService";
import companyRoutes from "./routes/companyRoutes";

startSharedService("Auth", companyRoutes);