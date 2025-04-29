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
  handleDeleteJob,
  handleUpdateJob,
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
router.delete("/:jobId", authenticateToken, handleDeleteJob); // Delete a job
router.patch("/:jobId", authenticateToken, handleUpdateJob); // Update a job
router.post("/:jobId/report", authenticateToken, handleReportJob); // Report a job

// Company jobs sub-resource
router.get("/company/:companyId", authenticateToken, handleGetCompanyJobs); // Get jobs by company ID

// Saved jobs sub-resource
router.get("/saved", authenticateToken, handleGetSavedJobs); // Get saved jobs
router.post("/saved/:jobId", authenticateToken, handleSaveJob); // Save a job
router.delete("/saved/:jobId", authenticateToken, handleRemoveSavedJob); // Remove a saved job

// Applications sub-resource
router.get("/applications", authenticateToken, handleGetUserApplications); // Get all applications for a user
router.get("/:jobId/applications", authenticateToken, handleGetJobApplications); // Get all applications for a job
router.post("/:jobId/applications", authenticateToken, upload.single("resume"), handleJobApplication); // Apply for a job
router.get("/applications/:applicationId/status", authenticateToken, handleGetApplicationStatus); // Get application status
router.patch("/applications/:applicationId/status", authenticateToken, handleUpdateApplicationStatus); // Update application status

export default router;
