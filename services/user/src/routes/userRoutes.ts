import authenticateToken from "@shared/middleware/authMiddleware";
import { Router } from "express";
import {
  deleteCoverPhoto,
  deleteProfilePicture,
  deleteResume,
  getUserProfile,
  updateUserProfile,
  uploadCoverPhoto,
  uploadProfilePicture,
  uploadResume,
} from "../controllers/userController";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = Router();

// Profile routes
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);

// Profile picture routes
router.post(
  "/profile/picture",
  authenticateToken,
  upload.single("file"),
  uploadProfilePicture
);
router.delete("/profile/picture", authenticateToken, deleteProfilePicture);

// Cover photo routes
router.post(
  "/profile/cover",
  authenticateToken,
  upload.single("file"),
  uploadCoverPhoto
);
router.delete("/profile/cover", authenticateToken, deleteCoverPhoto);

// Resume routes
router.post(
  "/profile/resume",
  authenticateToken,
  upload.single("file"),
  uploadResume
);
router.delete("/profile/resume", authenticateToken, deleteResume);

export default router;
