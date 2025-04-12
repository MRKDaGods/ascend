import authenticateToken from "@shared/middleware/authMiddleware";
import { Router } from "express";
import {
  deleteNotification,
  getUserNotifications,
  markAsRead,
} from "../controllers/notificationController";

const router = Router();

router.get("/", authenticateToken, getUserNotifications);
router.patch("/:id", authenticateToken, markAsRead);
router.delete("/:id", authenticateToken, deleteNotification);

export default router;