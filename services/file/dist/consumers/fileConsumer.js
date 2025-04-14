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
exports.handleFileDelete = exports.handleFileUploadRPC = exports.handleGetPresignedUrlRPC = void 0;
const fileUploadService_1 = require("../services/fileUploadService");
const fileValidation_1 = require("../validations/fileValidation");
/**
 * Handles the file.url_rpc event
 **/
const handleGetPresignedUrlRPC = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received file.rpc event:", JSON.stringify(payload));
    const file_id = payload.file_id;
    if (!file_id) {
        console.error("Invalid file ID");
        return null;
    }
    // Generate a pre-signed URL
    const fileUrl = yield (0, fileUploadService_1.getPresignedUrl)(file_id);
    console.log(`Generated pre-signed URL for file ${file_id}: ${fileUrl}`);
    const response = {
        file_id,
        presigned_url: fileUrl,
    };
    return response;
});
exports.handleGetPresignedUrlRPC = handleGetPresignedUrlRPC;
/**
 * Handles the file.upload_rpc event
 **/
const handleFileUploadRPC = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received file.upload event");
    console.log(`msg content: ${payload}`);
    if (!payload.user_id ||
        !payload.file_buffer ||
        !payload.file_name ||
        !payload.mime_type ||
        !payload.file_size) {
        throw new Error("Missing required fields for file upload");
    }
    if (!(0, fileValidation_1.validateFileSize)(payload.file_size)) {
        throw new Error("File size exceeds the maximum limit");
    }
    // Decode file buffer
    const buffer = Buffer.from(payload.file_buffer, "base64");
    // Create a mock Multer File object
    const file = {
        buffer,
        originalname: payload.file_name,
        mimetype: payload.mime_type,
        size: payload.file_size,
        fieldname: "file",
        encoding: "7bit",
        destination: "",
        filename: "",
        path: "",
        stream: null,
    };
    const fileId = yield (0, fileUploadService_1.uploadFileToMinIO)(payload.user_id, file, payload.context);
    const response = { file_id: fileId };
    return response;
});
exports.handleFileUploadRPC = handleFileUploadRPC;
/**
 * Handles the file.delete event
 **/
const handleFileDelete = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received file.deleted event:", payload);
    if (!payload.file_id) {
        console.error("Invalid file.deleted event received:", event);
        return;
    }
    // Delete!
    (0, fileUploadService_1.deleteFileFromMinIO)(payload.file_id);
    console.log(`Deleted file ${payload.file_id}`);
});
exports.handleFileDelete = handleFileDelete;
