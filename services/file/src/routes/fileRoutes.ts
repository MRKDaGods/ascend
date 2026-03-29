import { Router } from "express";
import { uploadFile, getFileMetadata, viewFile } from "../controllers/fileController";
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
router.get("/file/:fileId", authenticateToken, getFileMetadata);
router.get("/view", viewFile);

export default router;
