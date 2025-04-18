import startSharedService from "@shared/sharedService";
import morgan from "morgan";
import proxy from "express-http-proxy";
import { Request, Response, NextFunction } from "express";

// Setup logger
const logger = morgan("combined");

startSharedService("Gateway-Reverse-Proxy", undefined, {
  dontConnectRabbitMQ: true,
  customInit: async (app) => {
    const target = process.env.PROXY_TARGET;
    if (!target) {
      throw new Error("PROXY_TARGET is not defined");
    }

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

    // Forward everything to proxy
    app.use("/", conditionalProxy(target));
  },
});
