import authenticateToken from "@shared/middleware/authMiddleware";
import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";

const router = Router();

// Profile routes
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);

export default router;