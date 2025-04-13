import authenticateToken from "@shared/middleware/authMiddleware";
import { Router } from "express";
import {
  deleteNotification,
  getUserNotifications,
  markAsRead,
  markAsUnread,
} from "../controllers/notificationController";

const router = Router();

router.get("/", authenticateToken, getUserNotifications);
router.patch("/:id", authenticateToken, markAsRead);
router.post("/:id", authenticateToken, markAsUnread);
router.delete("/:id", authenticateToken, deleteNotification);

export default router;
