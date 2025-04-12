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

    const globalProxyOptions = {
      parseReqBody: false,
    };

    // Health check route
    app.get("/health", (_, res) => {
      res.send("Gateway is up and running");
    });

    // Auth service
    app.use("/auth", proxy("http://auth:3001", globalProxyOptions));

    // User service
    app.use("/user", proxy("http://user:3002", globalProxyOptions));

    // Post service
    app.use("/post", proxy("http://post:3005"));

    // Connection service
    app.use("/connection", proxy("http://connection:3006"));

    // Admin service
    app.use("/admin", proxy("http://admin:3007"));
    
    // File service with multipart form data handling
    app.use("/files", proxy("http://file:3003", globalProxyOptions));

    // Notification service
    app.use("/notifications", proxy("http://notification:3004", globalProxyOptions));
  },
});
