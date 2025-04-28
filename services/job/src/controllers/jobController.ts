import { Request, Response } from "express";
import {
  searchJobs,
  createJob,
  saveJob,
  removeSavedJob,
  getSavedJobs,
  submitJobApplication,
  getApplicationStatus,
  updateApplicationStatus,
  isUserJobCreator,
  getJobIdByApplicationId,
  getJobApplications,
  reportJob,
  isThereJobWithId,
} from "../services/jobService";
import validate from "@shared/middleware/validationMiddleware";
import {
  newJobValidationRules,
  jobApplicationValidationRules,
  jobApplicationStatusUpdateValidationRules,
  jobReportValidationRules,
} from "../validations/jobValidation";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";

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

    const jobs = await searchJobs(searchParams);
    res.json(jobs);
  } catch (error) {
    console.error("Error in handleJobSearch:", error);
    res.status(500).json({ error: "Server error" });
  }
};

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

export const handleGetSavedJobs = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const pageNumber = Number(req.query.page) || 1;
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

      const jobApplication = await submitJobApplication(
        userId,
        jobId,
        resume,
        email,
        phone
      );

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
  },
];

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

      const updatedApplication = await updateApplicationStatus(
        applicationId,
        status
      );

      if (!updatedApplication) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error in handleUpdateApplicationStatus:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

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

    const applications = await getJobApplications(jobId, pageNumber);
    res.json(applications);
  } catch (error) {
    console.error("Error in handleGetUserApplications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const handleReportJob = [
  ...jobReportValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const jobId = Number(req.params.jobId);
      const reason = req.body.reason;

      const jobExists = await isThereJobWithId(jobId);
      if (!jobExists) {
        return res.status(404).json({ error: "Job not found" });
      }

      const report = await reportJob(userId, jobId, reason);

      if (!report) {
        // user has already reported the job
        return res.status(409).json({
          error: "You have already reported this job.",
        });
      }

      res.sendStatus(201);
    } catch (error) {
      console.error("Error in handleReportJob:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];
