"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = __importDefault(require("@shared/middleware/authMiddleware"));
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
const router = (0, express_1.Router)();
// Profile routes
router.get("/profile", authMiddleware_1.default, userController_1.getUserProfile);
router.put("/profile", authMiddleware_1.default, userController_1.updateUserProfile);
router.get("/profile/:id", authMiddleware_1.default, userController_1.getUserProfileById);
// Profile picture routes
router.post("/profile/picture", authMiddleware_1.default, upload.single("file"), userController_1.uploadProfilePicture);
router.delete("/profile/picture", authMiddleware_1.default, userController_1.deleteProfilePicture);
// Cover photo routes
router.post("/profile/cover", authMiddleware_1.default, upload.single("file"), userController_1.uploadCoverPhoto);
router.delete("/profile/cover", authMiddleware_1.default, userController_1.deleteCoverPhoto);
// Resume routes
router.post("/profile/resume", authMiddleware_1.default, upload.single("file"), userController_1.uploadResume);
router.delete("/profile/resume", authMiddleware_1.default, userController_1.deleteResume);
exports.default = router;
