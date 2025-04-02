import startSharedService from "@shared/sharedService";
import messageRoutes from "./routes/messageRoutes";

startSharedService("Messaging", messageRoutes, {
    dontConnectRabbitMQ: true,
});