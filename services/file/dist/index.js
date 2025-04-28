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
const fileConsumer_1 = require("./consumers/fileConsumer");
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const fileUploadService_1 = require("./services/fileUploadService");
(0, sharedService_1.default)("File", fileRoutes_1.default, {
    registerConsumers: [
        () => __awaiter(void 0, void 0, void 0, function* () {
            // Register the file delete consumer
            yield (0, rabbitMQ_1.consumeEvents)((0, rabbitMQ_1.getQueueName)(rabbitMQ_1.Events.FILE_DELETE), rabbitMQ_1.Events.FILE_DELETE, fileConsumer_1.handleFileDelete);
        }),
    ],
    customInit: (_) => __awaiter(void 0, void 0, void 0, function* () {
        // Initialize MinIO
        yield (0, fileUploadService_1.initMinIO)();
    }),
    postMQInit: () => __awaiter(void 0, void 0, void 0, function* () {
        // Setup RPC server for pre-signed URLs
        yield (0, rabbitMQ_1.setupRPCServer)((0, rabbitMQ_1.getQueueName)(rabbitMQ_1.Events.FILE_URL_RPC), fileConsumer_1.handleGetPresignedUrlRPC);
        // Setup RPC server for file uploads
        // Transferring files through the broker isnt really recommended
        // but we have a 5mb limit, so we're fine
        yield (0, rabbitMQ_1.setupRPCServer)((0, rabbitMQ_1.getQueueName)(rabbitMQ_1.Events.FILE_UPLOAD_RPC), fileConsumer_1.handleFileUploadRPC);
    }),
});
