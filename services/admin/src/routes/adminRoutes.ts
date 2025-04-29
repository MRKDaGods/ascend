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
  handleGetPostReportsCount,
  handleGetJobReports,
  handleGetPostReports,
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
router.get("/posts/reports/count", handleGetPostReportsCount);

router.get("/jobs/reported", handleGetReportedJobs);
router.get("/jobs/:jobId/reports", handleGetJobReports);
router.patch("/jobs/reports/:reportId", handleUpdateJobReport);
router.delete("/jobs/:jobId", handleDeleteJob);

router.get("/posts/reported", handleGetReportedPosts);
router.get("/posts/:postId/reports", handleGetPostReports);
router.patch("/posts/reports/:reportId", handleUpdatePostReport);
router.delete("/posts/:postId", handleDeletePost);

export default router;
