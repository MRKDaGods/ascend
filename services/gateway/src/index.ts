import startSharedService from "@shared/sharedService";
import morgan from "morgan";
import proxy from "express-http-proxy";
import { Request, Response, NextFunction } from "express";

// Setup logger
const logger = morgan("combined");

startSharedService("Gateway", undefined, {
  dontConnectRabbitMQ: true,
  customInit: async (app) => {
    // Attach logger
    app.use(logger);

    // Conditional proxy-ing middleware
    // We dont want to parse the body ourselves if we're uploading files
    // aka multi-part requests
    const conditionalProxy = (target: string) => {
      return (req: Request, res: Response, next: NextFunction) => {
        const proxyOptions = {
          parseReqBody: !req.headers["x-no-parse-body"],
        };
        
        return proxy(target, proxyOptions)(req, res, next);
      };
    };

    // Health check route
    app.get("/health", (_, res) => {
      res.send("Gateway is up and running");
    });

    // Auth service
    app.use("/auth", conditionalProxy("http://auth:3001"));

    // User service
    app.use("/user", conditionalProxy("http://user:3002"));

    // File service
    app.use("/files", conditionalProxy("http://file:3003"));

    // Job service
    app.use("/jobs", proxy("http://job:3008"));

    // Messaging service
    app.use("/messages", proxy("http://message:3010"));

    // Notification service
    app.use(
      "/notifications",
      conditionalProxy("http://notification:3004")
    );
  },
});
