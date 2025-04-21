import { Router } from "express";
import authenticateToken from "@shared/middleware/authMiddleware";
import { checkUserIsAdmin } from "../middlewares/adminMiddlewares";
import { handleGetReportedJobs } from "../controllers/adminController";

const router = Router();

router.use(authenticateToken);
router.use(checkUserIsAdmin);

router.get("/jobs/reports", handleGetReportedJobs);

export default router;
