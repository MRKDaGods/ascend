import { Request, Response } from "express";
import validate from "@shared/middleware/validationMiddleware";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";

import {
  newJobValidationRules,
  atLeastOneFieldPresent,
  updateJobValidationRules,
  jobReportValidationRules,
  jobApplicationValidationRules,
  jobApplicationStatusUpdateValidationRules,
} from "../validations/jobValidation";

import {
  saveJob,
  deleteJob,
  createJob,
  updateJob,
  reportJob,
  searchJobs,
  getSavedJobs,
  removeSavedJob,
  isThereJobWithId,
  isUserJobCreator,
  getJobApplications,
  hasUserSavedJob,
  isUserCompanyCreator,
  getApplicationStatus,
  submitJobApplication,
  hasUserAppliedToJob,
  updateApplicationStatus,
  getJobsByCompanyId,
  getJobIdByApplicationId,
  getJobApplicationsByUserId,
  hasUserExceededApplicationLimit,
} from "../services/jobService";

/**
 * Handles job search requests
 * @param {Request} req - Express request object containing search parameters in query
 * @param {Response} res - Express response object
 */
export const handleJobSearch = async (req: Request, res: Response) => {
  try {
    // Validate salary range min and max values if provided
    if (
      req.query.salary_min_range &&
      req.query.salary_max_range &&
      Number(req.query.salary_min_range) > Number(req.query.salary_max_range)
    ) {
      return res.status(400).json({
        error:
          "Salary range min must be less than or equal to salary range max",
      });
    }

    // Validate page number if provided
    if (req.query.page && Number(req.query.page) < 1) {
      return res.status(400).json({ error: "Page number must be at least 1" });
    }

    // Extract search parameters from query string and explicitly type them
    const searchParams = {
      keyword: req.query.keyword ? String(req.query.keyword) : undefined,
      location: req.query.location
        ? String(req.query.location).split(",")
        : undefined,
      industry: req.query.industry
        ? String(req.query.industry).split(",")
        : undefined,
      experience_level: req.query.experience_level
        ? String(req.query.experience_level).split(",")
        : undefined,
      company: req.query.company
        ? String(req.query.company).split(",")
        : undefined,
      salary_min_range: req.query.salary_min_range
        ? Number(req.query.salary_min_range)
        : undefined,
      salary_max_range: req.query.salary_max_range
        ? Number(req.query.salary_max_range)
        : undefined,
      pageNumber: Number(req.query.page || 1),
    };

    // Query the database for jobs based on the search parameters
    const jobs = await searchJobs(searchParams);

    // Check if no jobs were found
    if (jobs.data.length === 0) {
      return res.status(404).json({ error: "No jobs found" });
    }

    // Send a 200 OK response with the jobs
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error in handleJobSearch:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Retrieves jobs associated with a specific company
 * @param {AuthenticatedRequest} req - Express request with authenticated user and company ID
 * @param {Response} res - Express response object
 */
export const handleGetCompanyJobs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const companyId = Number(req.params.companyId);
    const pageNumber = Number(req.query.page) || 1;

    // Validate page number
    if (pageNumber < 1) {
      return res.status(400).json({ error: "Page number must be at least 1" });
    }

    // Check if user is authorized to view the company's jobs
    const isCompanyCreator = await isUserCompanyCreator(userId, companyId);
    if (!isCompanyCreator) {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this company's jobs" });
    }

    // Get jobs for the company
    const jobs = await getJobsByCompanyId(companyId, pageNumber);

    // Check if no jobs were found
    if (jobs.data.length === 0) {
      return res.status(404).json({ error: "No jobs found for this company" });
    }

    // Send a 200 OK response with the jobs
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error in handleGetCompanyJobs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles the creation of a new job posting
 * @param {AuthenticatedRequest} req - Express request with authenticated user and job details
 * @param {Response} res - Express response object
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
      const salary_min_range = req.body.salary_min_range || null;
      const salary_max_range = req.body.salary_max_range || null;
      const company_id = req.body.company_id;
      const user_id = req.user!.id;

      // Check if the user is the creator of the company
      const isCompanyCreator = await isUserCompanyCreator(user_id, company_id);

      if (!isCompanyCreator) {
        return res.status(403).json({
          error: "You are not authorized to create a job for this company",
        });
      }

      // Create the job
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

      // Send a 201 Created response with the created job
      res.status(201).json(job);
    } catch (error) {
      console.error("Error in handleJobPosting:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

/**
 * Updates an existing job posting
 * @param {AuthenticatedRequest} req - Express request with authenticated user and job update details
 * @param {Response} res - Express response object
 */
export const handleUpdateJob = [
  atLeastOneFieldPresent,
  ...updateJobValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const jobId = Number(req.params.jobId);

      // Check if the user is authorized to update the job
      const isJobCreator = await isUserJobCreator(userId, jobId);
      if (!isJobCreator) {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this job" });
      }

      // Extract job update details from request body
      const title = req.body.title;
      const description = req.body.description;
      const industry = req.body.industry;
      const type = req.body.type;
      const experience_level = req.body.experience_level;
      const location = req.body.location;
      const workplace_type = req.body.workplace_type;
      const salary_min_range = req.body.salary_min_range;
      const salary_max_range = req.body.salary_max_range;

      // Update the job
      const updatedJob = await updateJob(
        jobId,
        title,
        description,
        industry,
        type,
        experience_level,
        location,
        workplace_type,
        salary_min_range,
        salary_max_range
      );

      // Send a 200 OK response with the updated job
      res.status(200).json(updatedJob);
    } catch (error) {
      console.error("Error in handleUpdateJob:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

/**
 * Deletes a job posting
 * @param {AuthenticatedRequest} req - Express request with authenticated user and job ID to delete
 * @param {Response} res - Express response object
 */
export const handleDeleteJob = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const jobId = Number(req.params.jobId);

    // Check if the user is authorized to delete the job
    const isJobCreator = await isUserJobCreator(userId, jobId);
    if (!isJobCreator) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this job" });
    }

    // Delete the job
    await deleteJob(jobId);

    // Send a 204 No Content response
    res.sendStatus(204);
  } catch (error) {
    console.error("Error in handleDeleteJob:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Saves a job for the authenticated user
 * @param {AuthenticatedRequest} req - Express request with authenticated user and job ID to save
 * @param {Response} res - Express response object
 */
export const handleSaveJob = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const job_id = Number(req.params.jobId);

    // Check if the job exists
    const jobExists = await isThereJobWithId(job_id);
    if (!jobExists) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if the job is already saved
    const jobAlreadySaved = await hasUserSavedJob(userId, job_id);
    if (jobAlreadySaved) {
      return res.status(409).json({ error: "Job already saved" });
    }

    // Save the job
    const savedJob = await saveJob(userId, job_id);

    // Send a 201 Created response with the saved job
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error in handleSaveJob:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Removes a job from the user's saved jobs
 * @param {AuthenticatedRequest} req - Express request with authenticated user and job ID to remove
 * @param {Response} res - Express response object
 */
export const handleRemoveSavedJob = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const jobId = Number(req.params.jobId);

    // Check if the user has saved the job
    const jobSaved = await hasUserSavedJob(userId, jobId);
    if (!jobSaved) {
      return res.status(404).json({ error: "Job not found in saved jobs" });
    }

    // Remove the job from saved jobs
    await removeSavedJob(userId, jobId);

    // Send a 204 No Content response
    res.sendStatus(204);
  } catch (error) {
    console.error("Error in handleRemoveSavedJob:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Retrieves saved jobs for the authenticated user
 * @param {AuthenticatedRequest} req - Express request with authenticated user
 * @param {Response} res - Express response object
 */
export const handleGetSavedJobs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const pageNumber = Number(req.query.page) || 1;

    // Validate page number
    if (pageNumber < 1) {
      return res.status(400).json({ error: "Page number must be at least 1" });
    }

    // Get saved jobs for the user
    const savedJobs = await getSavedJobs(userId, pageNumber);

    // Check if no saved jobs were found
    if (savedJobs.data.length === 0) {
      return res.status(404).json({ error: "No saved jobs found" });
    }

    // Send a 200 OK response with the saved jobs
    res.status(200).json(savedJobs);
  } catch (error) {
    console.error("Error in handleGetSavedJobs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles job application submission
 * @param {AuthenticatedRequest} req - Express request with authenticated user and application details
 * @param {Response} res - Express response object
 */
export const handleJobApplication = [
  ...jobApplicationValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const jobId = Number(req.params.jobId);
      const resume = req.file!;
      const email = req.body.email;
      const phone = req.body.phone;

      // Check if the job exists
      const jobExists = await isThereJobWithId(jobId);
      if (!jobExists) {
        return res.status(404).json({ error: "Job not found" });
      }

      // Check if the user has already applied for the job
      const hasApplied = await hasUserAppliedToJob(userId, jobId);
      if (hasApplied) {
        return res.status(409).json({ error: "Already applied to this job" });
      }

      // Check if the user has exceeded their application limit
      const hasExceededLimit = await hasUserExceededApplicationLimit(userId);
      if (hasExceededLimit) {
        return res.status(403).json({
          error:
            "Monthly application limit exceeded for your subscription plan",
        });
      }

      // Submit the job application
      const jobApplication = await submitJobApplication(
        userId,
        jobId,
        resume,
        email,
        phone
      );

      // Remove the job from saved jobs
      await removeSavedJob(userId, jobId);

      // Send a 201 Created response with the job application
      res.status(201).json(jobApplication);
    } catch (error) {
      console.error("Error in handleJobApplication:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

/**
 * Retrieves all job applications for the authenticated user
 * @param {AuthenticatedRequest} req - Express request with authenticated user
 * @param {Response} res - Express response object
 */
export const handleGetUserApplications = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const pageNumber = Number(req.query.page) || 1;

    // Validate page number
    if (pageNumber < 1) {
      return res.status(400).json({ error: "Page number must be at least 1" });
    }

    // Get applications for the user
    const applications = await getJobApplicationsByUserId(userId, pageNumber);

    // Check if no applications were found
    if (applications.data.length === 0) {
      return res.status(404).json({ error: "No applications found" });
    }

    // Send a 200 OK response with the applications
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error in handleGetUserApplications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Retrieves status of a specific job application
 * @param {AuthenticatedRequest} req - Express request with authenticated user and application ID
 * @param {Response} res - Express response object
 */
export const handleGetApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const applicationId = Number(req.params.applicationId);
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
 * Updates the status of a job application
 * @param {AuthenticatedRequest} req - Express request with authenticated user and new status
 * @param {Response} res - Express response object
 */
export const handleUpdateApplicationStatus = [
  ...jobApplicationStatusUpdateValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const status = req.body.status;
      const applicationId = Number(req.params.applicationId);
      const jobId = await getJobIdByApplicationId(applicationId);

      if (!jobId) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Check if the user is authorized to update the application status
      const canUpdateStatus = await isUserJobCreator(userId, jobId);
      if (!canUpdateStatus) {
        return res.status(403).json({ error: "Unauthorized to update status" });
      }

      // Update the application status
      await updateApplicationStatus(applicationId, status);

      // Send a 204 No Content response
      res.sendStatus(200);
    } catch (error) {
      console.error("Error in handleUpdateApplicationStatus:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

/**
 * Retrieves all applications for a specific job
 * @param {AuthenticatedRequest} req - Express request with authenticated user and job ID
 * @param {Response} res - Express response object
 */
export const handleGetJobApplications = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const jobId = Number(req.params.jobId);
    const pageNumber = Number(req.query.page) || 1;

    // Validate page number
    if (pageNumber < 1) {
      return res.status(400).json({ error: "Page number must be at least 1" });
    }

    // Check if the user is authorized to view the job applications
    const canViewApplications = await isUserJobCreator(userId, jobId);
    if (!canViewApplications) {
      return res
        .status(403)
        .json({ error: "Unauthorized to view applications" });
    }

    // Get applications for the job
    const applications = await getJobApplications(jobId, pageNumber);

    // Send a 200 OK response with the applications
    res.json(applications);
  } catch (error) {
    console.error("Error in handleGetUserApplications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles reporting a job posting for inappropriate content
 * @param {AuthenticatedRequest} req - Express request with authenticated user, job ID, and reason
 * @param {Response} res - Express response object
 */
export const handleReportJob = [
  ...jobReportValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const jobId = Number(req.params.jobId);
      const reason = req.body.reason;

      // Check if the job exists
      const jobExists = await isThereJobWithId(jobId);
      if (!jobExists) {
        return res.status(404).json({ error: "Job not found" });
      }

      // Submit the report
      const report = await reportJob(userId, jobId, reason);

      // Check if the user has already reported the job
      if (!report) {
        return res.status(409).json({
          error: "You have already reported this job.",
        });
      }

      // Send a 201 Created response
      res.sendStatus(201);
    } catch (error) {
      console.error("Error in handleReportJob:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];
