import authenticateToken from "@shared/middleware/authMiddleware";
import { Router } from "express";
import {
  getUserNotifications,
  markAsRead,
} from "../controllers/notificationController";

const router = Router();

router.get("/", authenticateToken, getUserNotifications);
router.patch("/:id", authenticateToken, markAsRead);

export default router;