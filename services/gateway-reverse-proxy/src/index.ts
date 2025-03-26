import startSharedService from "@shared/sharedService";
import morgan from "morgan";
import proxy from "express-http-proxy";

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

    // Forward everything to proxy
    app.use("/", proxy(target));
  },
});
