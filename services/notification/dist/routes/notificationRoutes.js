"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = __importDefault(require("@shared/middleware/authMiddleware"));
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, notificationController_1.getUserNotifications);
router.patch("/:id", authMiddleware_1.default, notificationController_1.markAsRead);
router.post("/:id", authMiddleware_1.default, notificationController_1.markAsUnread);
router.delete("/:id", authMiddleware_1.default, notificationController_1.deleteNotification);
exports.default = router;
