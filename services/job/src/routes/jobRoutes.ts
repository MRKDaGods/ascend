import { Router } from "express";
import authenticateToken from "@shared/middleware/authMiddleware";
import {
  handleGetJob,
  handleJobSearch,
  handleJobPosting,
  handleSaveJob,
  handleRemoveSavedJob,
  handleGetSavedJobs,
  handleJobApplication,
  handleGetApplicationStatus,
  handleUpdateApplicationStatus,
} from "../controllers/jobController";

/**
 * Express router for job-related API endpoints.
 * @module jobRouter
 */
const router = Router();

/**
 * Route to search for jobs with query parameters.
 * @name get/search
 * @function
 */
router.get("/search", handleJobSearch);

/**
 * Route to retrieve all saved jobs for an authenticated user.
 * @name get/save
 * @function
 * @protected
 */
router.get("/save", authenticateToken, handleGetSavedJobs);

/**
 * Route to create a new job posting.
 * @name post/
 * @function
 * @protected
 */
router.post("/", authenticateToken, handleJobPosting);

/**
 * Route to retrieve a specific job by ID.
 * @name get/:jobId
 * @function
 */
router.get("/:jobId", handleGetJob);

/**
 * Route to save a job for an authenticated user.
 * @name post/save/:jobId
 * @function
 * @protected
 */
router.post("/save/:jobId", authenticateToken, handleSaveJob);

/**
 * Route to remove a saved job for an authenticated user.
 * @name delete/save/:jobId
 * @function
 * @protected
 */
router.delete("/save/:jobId", authenticateToken, handleRemoveSavedJob);

/**
 * Route to apply for a job.
 * @name post/apply/:jobId
 * @function
 * @protected
 */
router.post("/apply/:jobId", authenticateToken, handleJobApplication);

/**
 * Route to retrieve the status of a job application.
 * @name get/applications/status/:applicationId
 * @function
 * @protected
 */
router.get(
  "/applications/status/:applicationId",
  authenticateToken,
  handleGetApplicationStatus
);

/**
 * Route to update the status of a job application.
 * @name put/applications/status/:applicationId
 * @function
 * @protected
 */
router.put(
  "/applications/status/:applicationId",
  authenticateToken,
  handleUpdateApplicationStatus
);

export default router;
