import { Router } from "express";
import authenticateToken from "@shared/middleware/authMiddleware";
import { isUserAdmin } from "../middlewares/adminMiddlewares";
import {
  handleDeleteJob,
  handleGetJobReportsCount,
  handleGetReportedJobs,
  handleUpdateJobReport,
  handleGetJobsCount,
  handleGetUsersCount,
  handleGetPostsCount,
  handleGetConnectionsCount,
  handleGetFollowsCount,
  handleDeletePost,
  handleGetReportedPosts,
  handleUpdatePostReport,
} from "../controllers/adminController";

const router = Router();

router.use(authenticateToken);
router.use(isUserAdmin);

router.get("/jobs/count", handleGetJobsCount);
router.get("/users/count", handleGetUsersCount);
router.get("/posts/count", handleGetPostsCount);
router.get("/follows/count", handleGetFollowsCount);
router.get("/connections/count", handleGetConnectionsCount);
router.get("/jobs/reports/count", handleGetJobReportsCount);

router.get("/jobs/reports", handleGetReportedJobs);
router.patch("/jobs/reports/:reportId", handleUpdateJobReport);
router.delete("/jobs/:jobId", handleDeleteJob);

router.get("posts/reports", handleGetReportedPosts);
router.patch("/posts/reports/:reportId", handleUpdatePostReport);
router.delete("/posts/:postId", handleDeletePost);

export default router;
