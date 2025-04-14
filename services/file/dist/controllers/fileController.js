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
exports.viewFile = exports.getFileMetadata = exports.uploadFile = void 0;
const fileUploadService_1 = require("../services/fileUploadService");
const jwt_1 = require("@shared/utils/jwt");
/**
 * Uploads a file
 *
 * @returns HTTP response
 * - 200 with the file ID
 * - 400 if no file uploaded
 * - 500 if server error
 */
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const userId = req.user.id;
        const fileId = yield (0, fileUploadService_1.uploadFileToMinIO)(userId, file);
        res.json({ fileId });
    }
    catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.uploadFile = uploadFile;
/**
 * Retrieves file metadata
 *
 * @returns HTTP response
 * - 200 with the file metadata
 * - 400 if no file ID provided or file not found
 * - 500 if server error
 */
const getFileMetadata = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = parseInt(req.params.fileId);
        if (!fileId) {
            return res.status(400).json({ error: "No file ID provided" });
        }
        // TODO: check if the user has access to the file
        const file = yield (0, fileUploadService_1.getFileMetadata)(fileId);
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }
        res.json(file);
    }
    catch (error) {
        console.error("Error getting file metadata:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getFileMetadata = getFileMetadata;
const viewFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({ error: "No token provided" });
        }
        const fileId = (0, jwt_1.verifyToken)(token).file_id;
        if (!fileId) {
            return res.status(400).json({ error: "No file ID provided" });
        }
        const buffer = yield (0, fileUploadService_1.getFileFromMinIO)(fileId);
        res.end(buffer);
    }
    catch (error) {
        console.error("Error viewing file:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.viewFile = viewFile;
