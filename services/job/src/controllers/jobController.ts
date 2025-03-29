import { Request, Response } from "express";
import { searchJobsByCriteria, createNewJob, saveJobForUser, removeSavedJobForUser, fetchUserSavedJobs, submitJobApplication, fetchApplicationStatus } from "../services/jobService";
import validate from "@shared/middleware/validationMiddleware";
import { newJobValidationRules } from "../validations/jobValidation";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";

/**
 * Handles job search requests with filtering
 * @param req - Express request object
 * @param res - Express response object
 * @returns - Array of jobs or error message
 */
export const handleJobSearch = async (req: Request, res: Response) => {
  try {
    const validParams = ['keyword', 'location', 'industry', 'experience_level', 'company_name', 'salary_range_min', 'salary_range_max'];
    const hasValidParams = Object.keys(req.query).some(param => validParams.includes(param));

    // Check if at least one valid search parameter is provided
    if (!hasValidParams) {
      return res.status(400).json({ error: "No valid search parameter" });
    }

    // Validate salary range min and max values if provided
    if (req.query.salary_range_min && req.query.salary_range_max && Number(req.query.salary_range_min) > Number(req.query.salary_range_max)) {
      return res.status(400).json({ error: "Salary range min must be less than or equal to salary range max" });
    }

    // Validate page number if provided
    if (req.query.pageNum && Number(req.query.pageNum) < 1) {
      return res.status(400).json({ error: "Page number must be at least 1" });
    }

    // Extract search parameters from query string and explicitly type them
    const searchParams = {
      keyword: req.query.keyword ? String(req.query.keyword) : undefined,
      location: req.query.location ? String(req.query.location) : undefined,
      industry: req.query.industry ? String(req.query.industry) : undefined,
      experience_level: req.query.experience_level ? String(req.query.experience_level) : undefined,
      company_name: req.query.company_name ? String(req.query.company_name) : undefined,
      salary_range_min: req.query.salary_range_min ? Number(req.query.salary_range_min) : undefined,
      salary_range_max: req.query.salary_range_max ? Number(req.query.salary_range_max) : undefined,
      pageNumber: Number(req.query.pageNum || 1),
    };

    // Query database for jobs based on search parameters
    const jobs = await searchJobsByCriteria(searchParams);

    // Return 404 if no jobs found
    if (!jobs) {
      return res.status(404).json({ error: "No jobs found" });
    }

    // Return array of jobs
    res.json(jobs);
  } catch (error) {
    console.error('Error in handleJobSearch:', error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles job posting creation with validation
 * @param req - Express request object
 * @param res - Express response object
 * @returns - Created job object or error message
 */
export const handleJobPosting = [
  ...newJobValidationRules,
  validate,
  async (req: Request, res: Response) => {
    // Extract job posting details from request body
    const {
      title,
      description,
      location,
      industry,
      experience_level,
      salary_range_min,
      salary_range_max,
      company_id,
      posted_by,
    } = req.body;

    try {
      const job = await createNewJob(
        title,
        description,
        location,
        industry,
        experience_level,
        salary_range_min,
        salary_range_max,
        company_id,
        posted_by
      );
      res.status(201).json(job);
    } catch (error) {
      console.error('Error in handleJobPosting:', error);
      res.status(500).json({ error: "Server error" });
    }
  }
];

/**
 * Handles saving a job for a user
 * @param req - Authenticated request object
 * @param res - Express response object
 * @returns - Saved job object or error message
 */
export const handleSaveJob = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const job_id = Number(req.params.jobId);
  try {
    const savedJob = await saveJobForUser(userId, job_id);
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error in handleSaveJob:', error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles removing a saved job for a user
 * @param req - Authenticated request object
 * @param res - Express response object
 * @returns - 204 status code or error message
 */
export const handleRemoveSavedJob = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const jobId = Number(req.params.jobId);
  try {
    const result = await removeSavedJobForUser(userId, jobId);
    if (result === false) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('Error in handleRemoveSavedJob:', error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles retrieving all saved jobs for a user
 * @param req - Authenticated request object
 * @param res - Express response object
 * @returns  - Array of saved jobs or error message
 */
export const handleGetSavedJobs = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  try {
    const savedJobs = await fetchUserSavedJobs(userId);
    if (!savedJobs) {
      return res.status(404).json({ error: "No saved jobs found" });
    }
    res.json(savedJobs);
  } catch (error) {
    console.error('Error in handleGetSavedJobs:', error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles job application submission
 * @param req - Authenticated request object
 * @param res - Express response object
 * @returns - Job application object or error message
 */
export const handleJobApplication = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const jobId = Number(req.params.jobId);
  try {
    const jobApplication = await submitJobApplication(userId, jobId);
    if (!jobApplication) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(201).json(jobApplication);
  } catch (error) {
    console.error('Error in handleJobApplication:', error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles retrieving application status
 * @param req - Authenticated request object
 * @param res - Express response object
 * @returns - Job application details or error message
 */
export const handleGetApplicationStatus = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const applicationId = Number(req.params.applicationId);
  try {
    const applicationStatus = await fetchApplicationStatus(applicationId, userId);
    if (!applicationStatus) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(applicationStatus);
  } catch (error) {
    console.error('Error in handleGetApplicationStatus:', error);
    res.status(500).json({ error: "Server error" });
  }
};