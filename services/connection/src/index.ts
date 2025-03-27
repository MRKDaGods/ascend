import startSharedService from "@shared/sharedService";
import connectionRoutes from "./routes/connectionRoutes";
startSharedService("Connection", connectionRoutes);
console.log("yarab Connection");



