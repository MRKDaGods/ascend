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
const rabbitMQ_1 = require("@shared/rabbitMQ");
const sharedService_1 = __importDefault(require("@shared/sharedService"));
const authConsumer_1 = require("./consumers/authConsumer");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userService_1 = require("./services/userService");
(0, sharedService_1.default)("Auth", authRoutes_1.default, {
    postMQInit: () => __awaiter(void 0, void 0, void 0, function* () {
        // Setup RPC server for user FCM token requests
        yield (0, rabbitMQ_1.setupRPCServer)((0, rabbitMQ_1.getQueueName)(rabbitMQ_1.Events.AUTH_FCM_TOKEN_RPC), authConsumer_1.handleGetUserFCMTokenRPC);
        // Setup RPC server for admin user requests
        yield (0, rabbitMQ_1.setupRPCServer)((0, rabbitMQ_1.getQueueName)(rabbitMQ_1.Events.AUTH_GET_ADMIN_RPC), authConsumer_1.handleGetAdminUserRPC);
        // Create admin user if it doesn't exist
        yield (0, userService_1.createAdminUser)();
    }),
});
