import { Router } from "express";
import {
  uploadFile,
  deleteFile,
  getFileUrl,
  getFileMetadata,
} from "../controllers/fileController";
import { uploadFileValidationRules } from "../validations/fileValidation";
import multer from "multer";
import authenticateToken from "@shared/middleware/authMiddleware";
import validate from "@shared/middleware/validationMiddleware";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = Router();

router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  uploadFileValidationRules,
  validate,
  uploadFile
);
router.delete("/file/:fileId", authenticateToken, deleteFile); // Redundant, but keep for now
router.get("/file/:fileId/url", getFileUrl);
router.get("/file/:fileId", authenticateToken, getFileMetadata);

export default router;
