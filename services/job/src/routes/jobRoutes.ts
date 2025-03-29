import { Router } from "express";
import authenticateToken from "@shared/middleware/authMiddleware";
import { handleJobSearch, handleJobPosting, handleSaveJob, handleRemoveSavedJob, handleGetSavedJobs, handleJobApplication, handleGetApplicationStatus } from "../controllers/jobController";

const router = Router();

router.get("/search", handleJobSearch);
router.post("/", authenticateToken, handleJobPosting);
router.get("/save", authenticateToken, handleGetSavedJobs);
router.post("/save/:jobId", authenticateToken, handleSaveJob);
router.delete("/save/:jobId", authenticateToken, handleRemoveSavedJob);
router.post("/:jobId/apply", authenticateToken, handleJobApplication);
router.get("/applications/:applicationId", authenticateToken, handleGetApplicationStatus);

export default router;