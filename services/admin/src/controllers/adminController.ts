import { Response } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import {
  deleteJob,
  deletePost,
  getConnectionsCount,
  getFollowsCount,
  getJobReportsCount,
  getJobsCount,
  getPostReportsCount,
  getPostsCount,
  getReportedJobs,
  getReportedPosts,
  getUsersCount,
  isThereJobReportWithId,
  isThereJobWithId,
  isTherePostReportWithId,
  isTherePostWithId,
  updateJobReportStatus,
  updatePostReportStatus,
} from "../services/adminService";

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

export const handleUpdateJobReport = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const reportId = Number(req.params.reportId);
    const status = req.body.status;

    // Validate the reportId
    const reportExists = await isThereJobReportWithId(reportId);
    if (!reportExists) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Validate the status value
    if (!["pending", "reviewed", "resolved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Update the job report status
    const result = await updateJobReportStatus(reportId, status);

    if (result === false) {
      return res.status(500).json({ error: "Failed to update report" });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error in handleUpdateJobReport:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleDeleteJob = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const jobId = Number(req.params.jobId);

    // Validate the jobId
    if (!jobId) {
      return res.status(400).json({ error: "Invalid job ID" });
    }

    // Validate if the job exists
    const jobExists = await isThereJobWithId(jobId);
    if (!jobExists) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Delete the job
    const result = await deleteJob(jobId);

    if (result === false) {
      return res.status(500).json({ error: "Failed to delete job" });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error in handleDeleteJob:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetJobReportsCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const duration = req.query.duration as string;
    let startDate: Date | undefined = undefined;

    // Handle duration parameter if provided
    if (duration) {
      const now = new Date();

      switch (duration) {
        case "day":
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          return res.status(400).json({
            error:
              "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
          });
      }
    }

    const count = await getJobReportsCount(startDate);
    res.json({ count });
  } catch (error) {
    console.error("Error in handleGetJobReportsCount:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetJobsCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const duration = req.query.duration as string;
    let startDate: Date | undefined = undefined;

    // Handle duration parameter if provided
    if (duration) {
      const now = new Date();

      switch (duration) {
        case "day":
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          return res.status(400).json({
            error:
              "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
          });
      }
    }

    const count = await getJobsCount(startDate);
    res.json({ count });
  } catch (error) {
    console.error("Error in handleGetJobsCount:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetUsersCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const duration = req.query.duration as string;
    let startDate: Date | undefined = undefined;

    // Handle duration parameter if provided
    if (duration) {
      const now = new Date();

      switch (duration) {
        case "day":
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          return res.status(400).json({
            error:
              "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
          });
      }
    }

    const count = await getUsersCount(startDate);
    res.json({ count });
  } catch (error) {
    console.error("Error in handleGetUsersCount:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetPostsCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const duration = req.query.duration as string;
    let startDate: Date | undefined = undefined;

    // Handle duration parameter if provided
    if (duration) {
      const now = new Date();

      switch (duration) {
        case "day":
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          return res.status(400).json({
            error:
              "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
          });
      }
    }

    const count = await getPostsCount(startDate);
    res.json({ count });
  } catch (error) {
    console.error("Error in handleGetPostsCount:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetConnectionsCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const duration = req.query.duration as string;
    let startDate: Date | undefined = undefined;

    // Handle duration parameter if provided
    if (duration) {
      const now = new Date();

      switch (duration) {
        case "day":
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          return res.status(400).json({
            error:
              "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
          });
      }
    }

    const count = await getConnectionsCount(startDate);
    res.json({ count });
  } catch (error) {
    console.error("Error in handleGetConnectionsCount:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetFollowsCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const duration = req.query.duration as string;
    let startDate: Date | undefined = undefined;

    // Handle duration parameter if provided
    if (duration) {
      const now = new Date();

      switch (duration) {
        case "day":
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          return res.status(400).json({
            error:
              "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
          });
      }
    }

    const count = await getFollowsCount(startDate);
    res.json({ count });
  } catch (error) {
    console.error("Error in handleGetFollowsCount:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetReportedPosts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const pageNumber = Number(req.query.page || 1);
    const reportedPosts = await getReportedPosts(pageNumber);
    res.json(reportedPosts);
  } catch (error) {
    console.error("Error in handleGetReportedPosts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleUpdatePostReport = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const reportId = Number(req.params.reportId);
    const status = req.body.status;
    const comment = req.body.comment;

    // Validate the reportId
    const reportExists = await isTherePostReportWithId(reportId);
    if (!reportExists) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Validate the status value
    if (!["pending", "reviewed", "resolved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Validate the admin comment is a string if provided
    if (comment && typeof comment !== "string") {
      return res.status(400).json({ error: "Invalid admin comment" });
    }

    // validate admin comment is not empty if provided
    if (comment && comment.trim() === "") {
      return res.status(400).json({ error: "Admin comment cannot be empty" });
    }

    // Update the post report status
    const result = await updatePostReportStatus(reportId, status, comment);

    if (result === false) {
      return res.status(500).json({ error: "Failed to update report" });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error in handleUpdatePostReport:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleDeletePost = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const postId = Number(req.params.postId);

    // Validate the postId
    if (!postId) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Validate if the post exists
    const postExists = await isTherePostWithId(postId);
    if (!postExists) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Delete the post
    const result = await deletePost(postId);

    if (result === false) {
      return res.status(500).json({ error: "Failed to delete post" });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error in handleDeletePost:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleGetPostReportsCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const duration = req.query.duration as string;
    let startDate: Date | undefined = undefined;

    // Handle duration parameter if provided
    if (duration) {
      const now = new Date();

      switch (duration) {
        case "day":
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          return res.status(400).json({
            error:
              "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
          });
      }
    }

    const count = await getPostReportsCount(startDate);
    res.json({ count });
  } catch (error) {
    console.error("Error in handleGetPostReportsCount:", error);
    res.status(500).json({ error: "Server error" });
  }
};
