import { Request, Response } from "express";
import {
  getJob,
  searchJobs,
  createJob,
  saveJob,
  removeSavedJob,
  getSavedJobs,
  submitJobApplication,
  getApplicationStatus,
  updateApplicationStatus,
} from "../services/jobService";
import validate from "@shared/middleware/validationMiddleware";
import { newJobValidationRules } from "../validations/jobValidation";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";

/**
 * Handles retrieving a specific job by its ID.
 * @param {import("express").Request} req - Express request object containing jobId in params.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends the job object or an error response.
 * @throws {Error} If the database query fails or job is not found.
 */
export const handleGetJob = async (req: Request, res: Response) => {
  try {
    const jobId = Number(req.params.jobId);
    const job = await getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error in handleGetJob:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles job search requests with filtering and pagination.
 * @param {import("express").Request} req - Express request object with query parameters for search.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends an array of jobs or an error response.
 * @throws {Error} If no valid search parameters are provided or database query fails.
 */
export const handleJobSearch = async (req: Request, res: Response) => {
  try {
    const validParams = [
      "keyword",
      "location",
      "industry",
      "experience_level",
      "company_name",
      "salary_range_min",
      "salary_range_max",
    ];
    const hasValidParams = Object.keys(req.query).some((param) =>
      validParams.includes(param)
    );

    // Check if at least one valid search parameter is provided
    if (!hasValidParams) {
      return res.status(400).json({ error: "No valid search parameter" });
    }

    // Validate salary range min and max values if provided
    if (
      req.query.salary_range_min &&
      req.query.salary_range_max &&
      Number(req.query.salary_range_min) > Number(req.query.salary_range_max)
    ) {
      return res.status(400).json({
        error:
          "Salary range min must be less than or equal to salary range max",
      });
    }

    // Validate page number if provided
    if (req.query.pageNum && Number(req.query.pageNumber) < 1) {
      return res.status(400).json({ error: "Page number must be at least 1" });
    }

    // Extract search parameters from query string and explicitly type them
    const searchParams = {
      keyword: req.query.keyword ? String(req.query.keyword) : undefined,
      location: req.query.location ? String(req.query.location) : undefined,
      industry: req.query.industry ? String(req.query.industry) : undefined,
      experience_level: req.query.experience_level
        ? String(req.query.experience_level)
        : undefined,
      company_name: req.query.company_name
        ? String(req.query.company_name)
        : undefined,
      salary_range_min: req.query.salary_range_min
        ? Number(req.query.salary_range_min)
        : undefined,
      salary_range_max: req.query.salary_range_max
        ? Number(req.query.salary_range_max)
        : undefined,
      pageNumber: Number(req.query.pageNumber || 1),
    };

    const jobs = await searchJobs(searchParams);
    res.json(jobs);
  } catch (error) {
    console.error("Error in handleJobSearch:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles job posting creation with validation.
 * @param {import("../shared/middleware/authMiddleware").AuthenticatedRequest} req - Authenticated request object with job details in body.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends the created job object or an error response.
 * @throws {Error} If validation fails or database query fails.
 */
export const handleJobPosting = [
  ...newJobValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Extract job posting details from request body
      const title = req.body.title;
      const description = req.body.description;
      const industry = req.body.industry;
      const type = req.body.type;
      const experience_level = req.body.experience_level;
      const location = req.body.location;
      const workplace_type = req.body.workplace_type;
      const salary_min_range = req.body.salary_range_min || null;
      const salary_max_range = req.body.salary_range_max || null;
      const company_id = req.body.company_id;
      const user_id = req.user!.id;

      const job = await createJob(
        title,
        description,
        industry,
        type,
        experience_level,
        location,
        workplace_type,
        salary_min_range,
        salary_max_range,
        company_id,
        user_id
      );
      res.status(201).json(job);
    } catch (error) {
      console.error("Error in handleJobPosting:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

/**
 * Handles saving a job for a user.
 * @param {import("../shared/middleware/authMiddleware").AuthenticatedRequest} req - Authenticated request object with jobId in params.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends the saved job object or an error response.
 * @throws {Error} If the database query fails.
 */
export const handleSaveJob = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;
  const job_id = Number(req.params.jobId);
  try {
    const savedJob = await saveJob(userId, job_id);
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error in handleSaveJob:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles removing a saved job for a user.
 * @param {import("../shared/middleware/authMiddleware").AuthenticatedRequest} req - Authenticated request object with jobId in params.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a 204 status or an error response.
 * @throws {Error} If the job is not found or database query fails.
 */
export const handleRemoveSavedJob = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;
  const jobId = Number(req.params.jobId);
  try {
    const result = await removeSavedJob(userId, jobId);
    if (result === false) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error("Error in handleRemoveSavedJob:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles retrieving all saved jobs for a user with pagination.
 * @param {import("../shared/middleware/authMiddleware").AuthenticatedRequest} req - Authenticated request object with optional pageNumber in query.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends an array of saved jobs or an error response.
 * @throws {Error} If the page number is invalid or database query fails.
 */
export const handleGetSavedJobs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const pageNumber = Number(req.query.pageNumber) || 1;
    if (pageNumber < 1) {
      return res.status(400).json({ error: "Page number must be at least 1" });
    }
    const savedJobs = await getSavedJobs(userId, pageNumber);
    res.json(savedJobs);
  } catch (error) {
    console.error("Error in handleGetSavedJobs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles job application submission.
 * @param {import("../shared/middleware/authMiddleware").AuthenticatedRequest} req - Authenticated request object with jobId in params.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends the job application object or an error response.
 * @throws {Error} If the job is not found or database query fails.
 */
export const handleJobApplication = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;
  const jobId = Number(req.params.jobId);
  try {
    const jobApplication = await submitJobApplication(userId, jobId);
    if (!jobApplication) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Remove the job from saved jobs
    await removeSavedJob(userId, jobId);

    res.status(201).json(jobApplication);
  } catch (error) {
    console.error("Error in handleJobApplication:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles retrieving application status.
 * @param {import("../shared/middleware/authMiddleware").AuthenticatedRequest} req - Authenticated request object with applicationId in params.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends the application details or an error response.
 * @throws {Error} If the application is not found or database query fails.
 */
export const handleGetApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;
  const applicationId = Number(req.params.applicationId);
  try {
    const applicationStatus = await getApplicationStatus(applicationId, userId);
    if (!applicationStatus) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(applicationStatus);
  } catch (error) {
    console.error("Error in handleGetApplicationStatus:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles updating application status.
 * @param {import("../shared/middleware/authMiddleware").AuthenticatedRequest} req - Authenticated request object with applicationId in params and status in body.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends the updated application or an error response.
 * @throws {Error} If the status is invalid, application is not found, or database query fails.
 */
export const handleUpdateApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user!.id;
  const applicationId = Number(req.params.applicationId);
  const status = req.body.status;
  try {
    // Validate status value
    const validStatuses = ["Pending", "Viewed", "Rejected", "Accepted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status value. Valid values are: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    const updatedApplication = await updateApplicationStatus(
      applicationId,
      userId,
      status
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(updatedApplication);
  } catch (error) {
    console.error("Error in handleUpdateApplicationStatus:", error);
    res.status(500).json({ error: "Server error" });
  }
};
