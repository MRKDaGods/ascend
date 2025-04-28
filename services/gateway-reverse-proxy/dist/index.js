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
(0, sharedService_1.default)("Gateway-Reverse-Proxy", undefined, {
    dontConnectRabbitMQ: true,
    customInit: (app) => __awaiter(void 0, void 0, void 0, function* () {
        const target = process.env.PROXY_TARGET;
        if (!target) {
            throw new Error("PROXY_TARGET is not defined");
        }
        // Attach logger
        app.use(logger);
        // Forward everything to proxy
        app.use("/", (0, express_http_proxy_1.default)(target));
    }),
});
