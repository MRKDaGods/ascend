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

const router = Router();

router.get("/search", handleJobSearch);
router.get("/save", authenticateToken, handleGetSavedJobs);
router.post("/", authenticateToken, handleJobPosting);
router.get("/:jobId", handleGetJob);
router.post("/save/:jobId", authenticateToken, handleSaveJob);
router.delete("/save/:jobId", authenticateToken, handleRemoveSavedJob);
router.post("/apply/:jobId", authenticateToken, handleJobApplication);
router.get(
  "/applications/status/:applicationId",
  authenticateToken,
  handleGetApplicationStatus
);
router.patch(
  "/applications/status/:applicationId",
  authenticateToken,
  handleUpdateApplicationStatus
);

export default router;
