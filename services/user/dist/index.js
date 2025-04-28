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
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const rabbitMQ_1 = require("@shared/rabbitMQ");
const userConsumer_1 = require("./consumers/userConsumer");
(0, sharedService_1.default)("User", userRoutes_1.default, {
    registerConsumers: [
        () => __awaiter(void 0, void 0, void 0, function* () {
            // Register the user created consumer
            yield (0, rabbitMQ_1.consumeEvents)((0, rabbitMQ_1.getQueueName)(rabbitMQ_1.Events.USER_CREATED), rabbitMQ_1.Events.USER_CREATED, userConsumer_1.handleUserCreated);
        }),
    ],
    postMQInit: () => __awaiter(void 0, void 0, void 0, function* () {
        // Setup RPC server for profile picture requests
        yield (0, rabbitMQ_1.setupRPCServer)((0, rabbitMQ_1.getQueueName)(rabbitMQ_1.Events.USER_PROFILE_PIC_RPC), userConsumer_1.handleUserProfilePicRequestRPC);
        // Setup RPC server for profile requests
        yield (0, rabbitMQ_1.setupRPCServer)((0, rabbitMQ_1.getQueueName)(rabbitMQ_1.Events.USER_PROFILE_RPC), userConsumer_1.handleGetUserProfileRequestRPC);
    }),
});
