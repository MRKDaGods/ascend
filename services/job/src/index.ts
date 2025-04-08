import startSharedService from "@shared/sharedService";
import jobRoutes from "./routes/jobRoutes";

startSharedService("Job", jobRoutes, {
  dontConnectRabbitMQ: true,
});
