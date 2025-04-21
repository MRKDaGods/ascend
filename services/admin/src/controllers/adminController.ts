import { Response } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { getReportedJobs } from "../services/adminService";

export const handleGetReportedJobs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const pageNumber = Number(req.query.page || 1);
    const reportedJobs = await getReportedJobs(pageNumber);
    res.json(reportedJobs);
  } catch (error) {
    console.error("Error in handleGetReportedJobs:", error);
    res.status(500).json({ error: "Server error" });
  }
};
