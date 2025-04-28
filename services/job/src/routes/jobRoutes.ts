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
  handleGetCompanyJobs,
} from "../controllers/jobController";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = Router();

// Jobs resource
router.get("/", handleJobSearch);                         // Search jobs (with query params)
router.post("/", authenticateToken, handleJobPosting);    // Create a job
router.post("/:jobId/report", authenticateToken, handleReportJob);

// Company jobs sub-resource
router.get("/company/:companyId", authenticateToken, handleGetCompanyJobs);

// Saved jobs sub-resource
router.get("/saved", authenticateToken, handleGetSavedJobs);
router.post("/saved/:jobId", authenticateToken, handleSaveJob);
router.delete("/saved/:jobId", authenticateToken, handleRemoveSavedJob);

// Applications sub-resource
router.get("/applications", authenticateToken, handleGetUserApplications);
router.get("/:jobId/applications", authenticateToken, handleGetJobApplications);
router.post("/:jobId/applications", authenticateToken, upload.single("resume"), handleJobApplication);
router.get("/applications/:applicationId/status", authenticateToken, handleGetApplicationStatus);
router.patch("/applications/:applicationId/status", authenticateToken, handleUpdateApplicationStatus);

export default router;
