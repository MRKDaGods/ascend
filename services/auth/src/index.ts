import startSharedService from "@shared/sharedService";
import authRoutes from "./routes/authRoutes";

startSharedService("Auth", authRoutes);