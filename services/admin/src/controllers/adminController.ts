import { Response } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import {
  deleteJob,
  deletePost,
  getConnectionsCount,
  getFollowsCount,
  getJobReports,
  getJobReportsCount,
  getJobsCount,
  getPostReports,
  getPostReportsCount,
  getPostsCount,
  getReportedJobs,
  getReportedPosts,
  getSubscriptionsCount,
  getUsersCount,
  isThereJobReportWithId,
  isThereJobWithId,
  isTherePostReportWithId,
  isTherePostWithId,
  updateJobReportStatus,
  updatePostReportStatus,
} from "../services/adminService";

/**
 * Retrieves reported jobs with pagination
 *
 * @param req - The authenticated request object with page query parameter
 * @param res - The response object
 *
 * @returns JSON response with paginated reported jobs or error
 *
 * @throws 404 - When no reported jobs are found
 * @throws 500 - When server error occurs
 */
export const handleGetReportedJobs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const pageNumber = Number(req.query.page || 1);
    const reportedJobs = await getReportedJobs(pageNumber);

    if (reportedJobs.data.length === 0) {
      return res.status(404).json({ error: "No reported jobs found" });
    }

    res.json(reportedJobs);
  } catch (error) {
    console.error("Error in handleGetReportedJobs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Retrieves reports for a specific job with pagination
 *
 * @param req - The authenticated request object with jobId param and page query
 * @param res - The response object
 *
 * @returns JSON response with paginated job reports or error
 *
 * @throws 404 - When no reports are found for the job
 * @throws 500 - When server error occurs
 */
export const handleGetJobReports = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const jobId = Number(req.params.jobId);
    const pageNumber = Number(req.query.page || 1);

    const jobReports = await getJobReports(jobId, pageNumber);

    if (jobReports.data.length === 0) {
      return res.status(404).json({ error: "No reports found for this job" });
    }

    res.json(jobReports);
  } catch (error) {
    console.error("Error in handleGetJobReports:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Updates the status of a job report
 *
 * @param req - The authenticated request with reportId param and status in body
 * @param res - The response object
 *
 * @returns 200 status on success or error response
 *
 * @throws 400 - When invalid status value is provided
 * @throws 404 - When report is not found
 * @throws 500 - When server error occurs or update fails
 */
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

/**
 * Deletes a job by ID
 *
 * @param req - The authenticated request with jobId parameter
 * @param res - The response object
 *
 * @returns 200 status on success or error response
 *
 * @throws 400 - When invalid job ID is provided
 * @throws 404 - When job is not found
 * @throws 500 - When server error occurs or deletion fails
 */
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

/**
 * Gets the count of job reports with optional time filtering
 *
 * @param req - The authenticated request with optional duration query parameter
 * @param res - The response object
 *
 * @returns JSON response with job reports count or error
 *
 * @throws 400 - When invalid duration parameter is provided
 * @throws 500 - When server error occurs
 */
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

/**
 * Gets the count of jobs with optional time filtering
 *
 * @param req - The authenticated request with optional duration query parameter
 * @param res - The response object
 *
 * @returns JSON response with jobs count or error
 *
 * @throws 400 - When invalid duration parameter is provided
 * @throws 500 - When server error occurs
 */
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

/**
 * Gets the count of users with optional time filtering
 *
 * @param req - The authenticated request with optional duration query parameter
 * @param res - The response object
 *
 * @returns JSON response with users count or error
 *
 * @throws 400 - When invalid duration parameter is provided
 * @throws 500 - When server error occurs
 */
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

/**
 * Gets the count of posts with optional time filtering
 *
 * @param req - The authenticated request with optional duration query parameter
 * @param res - The response object
 *
 * @returns JSON response with posts count or error
 *
 * @throws 400 - When invalid duration parameter is provided
 * @throws 500 - When server error occurs
 */
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

/**
 * Gets the count of connections with optional time filtering
 *
 * @param req - The authenticated request with optional duration query parameter
 * @param res - The response object
 *
 * @returns JSON response with connections count or error
 *
 * @throws 400 - When invalid duration parameter is provided
 * @throws 500 - When server error occurs
 */
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

/**
 * Gets the count of follows with optional time filtering
 *
 * @param req - The authenticated request with optional duration query parameter
 * @param res - The response object
 *
 * @returns JSON response with follows count or error
 *
 * @throws 400 - When invalid duration parameter is provided
 * @throws 500 - When server error occurs
 */
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

/**
 * Retrieves reported posts with pagination
 *
 * @param req - The authenticated request object with page query parameter
 * @param res - The response object
 *
 * @returns JSON response with paginated reported posts or error
 *
 * @throws 404 - When no reported posts are found
 * @throws 500 - When server error occurs
 */
export const handleGetReportedPosts = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const pageNumber = Number(req.query.page || 1);
    const reportedPosts = await getReportedPosts(pageNumber);

    if (reportedPosts.data.length === 0) {
      return res.status(404).json({ error: "No reported posts found" });
    }

    res.json(reportedPosts);
  } catch (error) {
    console.error("Error in handleGetReportedPosts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Retrieves reports for a specific post with pagination
 *
 * @param req - The authenticated request with postId param and page query
 * @param res - The response object
 *
 * @returns JSON response with paginated post reports or error
 *
 * @throws 404 - When no reports are found for the post
 * @throws 500 - When server error occurs
 */
export const handleGetPostReports = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const postId = Number(req.params.postId);
    const pageNumber = Number(req.query.page || 1);
    const postReports = await getPostReports(postId, pageNumber);
    if (postReports.data.length === 0) {
      return res.status(404).json({ error: "No reports found for this post" });
    }
    res.json(postReports);
  } catch (error) {
    console.error("Error in handleGetPostReports:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Updates the status and optional comment of a post report
 *
 * @param req - The authenticated request with reportId param and status/comment in body
 * @param res - The response object
 *
 * @returns 200 status on success or error response
 *
 * @throws 400 - When invalid status or comment is provided
 * @throws 404 - When report is not found
 * @throws 500 - When server error occurs or update fails
 */
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

/**
 * Deletes a post by ID
 *
 * @param req - The authenticated request with postId parameter
 * @param res - The response object
 *
 * @returns 200 status on success or error response
 *
 * @throws 400 - When invalid post ID is provided
 * @throws 404 - When post is not found
 * @throws 500 - When server error occurs or deletion fails
 */
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

/**
 * Gets the count of post reports with optional time filtering
 *
 * @param req - The authenticated request with optional duration query parameter
 * @param res - The response object
 *
 * @returns JSON response with post reports count or error
 *
 * @throws 400 - When invalid duration parameter is provided
 * @throws 500 - When server error occurs
 */
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

/**
 * Gets the count of subscriptions with optional time filtering
 *
 * @param req - The authenticated request with optional duration query parameter
 * @param res - The response object
 *
 * @returns JSON response with subscription count or error
 *
 * @throws 400 - When invalid duration parameter is provided
 * @throws 500 - When server error occurs
 */
export const handleGetSubscriptionsCount = async (
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

    const count = await getSubscriptionsCount(startDate);
    res.json({ count });
  } catch (error) {
    console.error("Error in handleGetSubscriptionsCount:", error);
    res.status(500).json({ error: "Server error" });
  }
};
