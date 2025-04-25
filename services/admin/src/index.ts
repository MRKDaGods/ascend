import startSharedService from "@shared/sharedService";
import adminRoutes from "./routes/adminRoutes";

startSharedService("Admin", adminRoutes);
