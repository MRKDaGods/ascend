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

    // Forward everything to proxy with enhanced options
    app.use(
      "/",
      proxy(target, {
        https: true,
        proxyReqOptDecorator: (proxyReqOpts) => {
          // Initialize headers if they don't exist
          proxyReqOpts.headers = proxyReqOpts.headers || {};
          // Ensure headers are properly forwarded
          proxyReqOpts.headers["Host"] = new URL(target).host;
          // Remove any existing x-forwarded headers to avoid issues
          delete proxyReqOpts.headers["x-forwarded-for"];
          delete proxyReqOpts.headers["x-forwarded-host"];
          delete proxyReqOpts.headers["x-forwarded-proto"];

          return proxyReqOpts;
        },
        // Properly handle redirects
        userResHeaderDecorator: (
          headers,
          userReq,
          userRes,
          proxyReq,
          proxyRes
        ) => {
          // If there's a location header (redirect), ensure it points to our proxy
          if (headers.location && headers.location.startsWith(target)) {
            // Replace the target URL with our proxy URL in the location header
            headers.location = headers.location.replace(
              target,
              `${userReq.protocol}://${userReq.get("host")}`
            );
          }
          return headers;
        },
      })
    );
  },
});
