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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresignedUrl = void 0;
const rabbitMQ_1 = require("@shared/rabbitMQ");
const __1 = require("..");
/**
 * Retrieves a presigned URL for a file
 *
 * @param fileId - The ID of the file to retrieve the URL for
 * @returns The presigned URL
 */
const getPresignedUrl = (fileId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fileId) {
        return null;
    }
    try {
        const fileRpcQueue = (0, rabbitMQ_1.getRPCQueueName)(__1.Services.FILE, rabbitMQ_1.Events.FILE_URL_RPC);
        const payload = {
            file_id: fileId,
        };
        const response = yield (0, rabbitMQ_1.callRPC)(fileRpcQueue, payload);
        return response.presigned_url;
    }
    catch (error) {
        console.error(`Error getting presigned URL for file ${fileId}:`, error);
        return null;
    }
});
exports.getPresignedUrl = getPresignedUrl;
