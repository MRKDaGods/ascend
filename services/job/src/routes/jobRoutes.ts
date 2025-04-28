import { Router } from "express";
import authenticateToken from "@shared/middleware/authMiddleware";
import {
  handleJobSearch,
  handleJobPosting,
  handleSaveJob,
  handleRemoveSavedJob,
  handleGetSavedJobs,
  handleJobApplication,
  handleGetApplicationStatus,
  handleUpdateApplicationStatus,
  handleGetJobApplications,
  handleReportJob,
  handleGetUserApplications,
} from "../controllers/jobController";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = Router();

router.get("/search", handleJobSearch);
router.get("/save", authenticateToken, handleGetSavedJobs);
router.post("/", authenticateToken, handleJobPosting);
router.post("/save/:jobId", authenticateToken, handleSaveJob);
router.delete("/save/:jobId", authenticateToken, handleRemoveSavedJob);
router.post(
  "/apply/:jobId",
  authenticateToken,
  upload.single("resume"),
  handleJobApplication
);
router.post("/:jobId/report", authenticateToken, handleReportJob);
router.get("/applications", authenticateToken, handleGetUserApplications);
router.get(
  "/applications/:applicationId/status",
  authenticateToken,
  handleGetApplicationStatus
);
router.patch(
  "/applications/:applicationId/status",
  authenticateToken,
  handleUpdateApplicationStatus
);
router.get(
  "/applications/job/:jobId",
  authenticateToken,
  handleGetJobApplications
);
export default router;
