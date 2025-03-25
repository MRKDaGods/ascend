import startSharedService from "@shared/sharedService";
import morgan from "morgan";
import proxy from "express-http-proxy";

// Setup logger
const logger = morgan("combined");

startSharedService("Gateway", undefined, {
  dontConnectRabbitMQ: true,
  customInit: async (app) => {
    // Attach logger
    app.use(logger);

    // Health check route
    app.get("/health", (_, res) => {
      res.send("Gateway is up and running");
    });

    // Auth service
    app.use("/auth", proxy("http://auth:3001"));

    // User service
    app.use("/user", proxy("http://user:3002"));

    // File service
    app.use("/files", proxy("http://file:3003"));

    // Notification service
    app.use("/notification", proxy("http://notification:3004"));
  },
});
