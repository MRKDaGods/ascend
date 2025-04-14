"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharedService_1 = __importDefault(require("@shared/sharedService"));
const morgan_1 = __importDefault(require("morgan"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
// Setup logger
const logger = (0, morgan_1.default)("combined");
(0, sharedService_1.default)("Gateway", undefined, {
    dontConnectRabbitMQ: true,
    customInit: (app) => __awaiter(void 0, void 0, void 0, function* () {
        // Attach logger
        app.use(logger);
        // Conditional proxy-ing middleware
        // We dont want to parse the body ourselves if we're uploading files
        // aka multi-part requests
        const conditionalProxy = (target) => {
            return (req, res, next) => {
                const proxyOptions = {
                    parseReqBody: !req.headers["x-no-parse-body"],
                };
                return (0, express_http_proxy_1.default)(target, proxyOptions)(req, res, next);
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
        // Notification service
        app.use("/notifications", conditionalProxy("http://notification:3004"));
    }),
});
