import startSharedService from "@shared/sharedService";

startSharedService("Notification", undefined, {
  dontConnectRabbitMQ: true,
});
