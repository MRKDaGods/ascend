"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileController_1 = require("../controllers/fileController");
const fileValidation_1 = require("../validations/fileValidation");
const multer_1 = __importDefault(require("multer"));
const authMiddleware_1 = __importDefault(require("@shared/middleware/authMiddleware"));
const validationMiddleware_1 = __importDefault(require("@shared/middleware/validationMiddleware"));
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
const router = (0, express_1.Router)();
router.post("/upload", authMiddleware_1.default, upload.single("file"), fileValidation_1.uploadFileValidationRules, validationMiddleware_1.default, fileController_1.uploadFile);
router.get("/file/:fileId", authMiddleware_1.default, fileController_1.getFileMetadata);
router.get("/view", fileController_1.viewFile);
exports.default = router;
