import authenticateToken from "@shared/middleware/authMiddleware";
import { Router } from "express";
import {
  deleteNotification,
  getUserNotifications,
  markAsRead,
  markAsUnread,
  sendNotification,
} from "../controllers/notificationController";

const router = Router();

router.get("/", authenticateToken, getUserNotifications);
router.patch("/:id", authenticateToken, markAsRead);
router.post("/:id", authenticateToken, markAsUnread);
router.delete("/:id", authenticateToken, deleteNotification);
router.post("/crx/send", authenticateToken, sendNotification);

export default router;
