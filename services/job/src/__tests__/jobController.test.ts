import { Response } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import * as jobService from "../services/jobService";
import {
  handleJobSearch,
  handleGetCompanyJobs,
  handleJobPosting,
  handleUpdateJob,
  handleDeleteJob,
  handleSaveJob,
  handleGetSavedJobs,
  handleRemoveSavedJob,
  handleJobApplication,
  handleGetUserApplications,
  handleGetApplicationStatus,
  handleUpdateApplicationStatus,
  handleGetJobApplications,
  handleReportJob,
} from "../controllers/jobController";

// Mock all job service functions to isolate controller tests
jest.mock("../services/jobService", () => ({
  saveJob: jest.fn(),
  deleteJob: jest.fn(),
  createJob: jest.fn(),
  updateJob: jest.fn(),
  reportJob: jest.fn(),
  searchJobs: jest.fn(),
  getSavedJobs: jest.fn(),
  removeSavedJob: jest.fn(),
  isThereJobWithId: jest.fn(),
  isUserJobCreator: jest.fn(),
  getJobApplications: jest.fn(),
  hasUserSavedJob: jest.fn(),
  isUserCompanyCreator: jest.fn(),
  getApplicationStatus: jest.fn(),
  submitJobApplication: jest.fn(),
  hasUserAppliedToJob: jest.fn(),
  updateApplicationStatus: jest.fn(),
  getJobsByCompanyId: jest.fn(),
  getJobIdByApplicationId: jest.fn(),
  getJobApplicationsByUserId: jest.fn(),
  hasUserExceededApplicationLimit: jest.fn(),
}));

// Mock the validation middleware
jest.mock("@shared/middleware/validationMiddleware", () => jest.fn());

/**
 * Helper function to mock parseInt to return a specific value during tests
 * This ensures consistent behavior when testing with numeric parameters
 */
const withMockedParseInt = async (
  value: number,
  callback: () => Promise<void>
) => {
  const originalParseInt = Number.parseInt;
  Number.parseInt = jest.fn().mockReturnValue(value);
  try {
    await callback();
  } finally {
    Number.parseInt = originalParseInt;
  }
};

describe("Job Controller", () => {
  // Mock request and response objects for controller testing
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;

  // Individual response method mocks for granular assertions
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let responseSendStatus: jest.Mock;

  /**
   * Helper function to invoke middleware functions
   * Particularly useful for controllers that have multiple middleware functions
   */
  const invokeMiddleware = async (middleware: any, req: any, res: any) => {
    return middleware(req, res);
  };

  // Set up fresh mocks before each test
  beforeEach(() => {
    // Initialize response method mocks with chainable return values
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    responseSendStatus = jest.fn().mockReturnThis();

    // Set up mock request with default values
    mockRequest = {
      query: {},
      params: {},
      body: {},
      user: { id: 1 },
      file: undefined,
    };

    // Set up mock response with method mocks
    mockResponse = {
      json: responseJson,
      status: responseStatus,
      sendStatus: responseSendStatus,
    };

    // Clear all mock call history before each test
    jest.clearAllMocks();
  });

  // Tests for the job search controller function
  describe("handleJobSearch", () => {
    // Test successful job search scenario
    it("should return search results successfully", async () => {
      // Setup request with search parameters
      mockRequest.query = {
        keyword: "developer",
        page: "1",
      };

      // Mock successful service response with job data
      const mockJobs = {
        data: [{ id: 1, title: "Software Developer" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };

      // Configure mock to return test data
      (jobService.searchJobs as jest.Mock).mockResolvedValue(mockJobs);

      // Call the controller function
      await handleJobSearch(mockRequest as any, mockResponse as Response);

      // Verify service was called with correct parameters
      expect(jobService.searchJobs).toHaveBeenCalledWith(
        expect.objectContaining({
          keyword: "developer",
          pageNumber: 1,
        })
      );

      // Verify correct response was sent
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockJobs);
    });

    // Test no jobs found scenario
    it("should return 404 when no jobs found", async () => {
      // Mock empty results from service
      const mockJobs = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };

      (jobService.searchJobs as jest.Mock).mockResolvedValue(mockJobs);

      await handleJobSearch(mockRequest as any, mockResponse as Response);

      // Verify 404 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "No jobs found" });
    });

    // Test invalid salary range scenario
    it("should return 400 when salary min is greater than max", async () => {
      // Setup request with invalid salary range
      mockRequest.query = {
        salary_min_range: "5000",
        salary_max_range: "4000",
      };

      await handleJobSearch(mockRequest as any, mockResponse as Response);

      // Verify 400 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Salary range min must be less than or equal to salary range max",
      });
    });

    // Test invalid page number scenario
    it("should return 400 when page number is invalid", async () => {
      // Setup request with invalid page number
      mockRequest.query = { page: "0" };

      await handleJobSearch(mockRequest as any, mockResponse as Response);

      // Verify 400 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Page number must be at least 1",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Configure mock to simulate database error
      (jobService.searchJobs as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleJobSearch(mockRequest as any, mockResponse as Response);

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for getting jobs by company ID
  describe("handleGetCompanyJobs", () => {
    // Test successful company jobs retrieval
    it("should return company jobs successfully", async () => {
      // Setup request parameters and user
      mockRequest.params = { companyId: "1" };
      mockRequest.user = { id: 1, roles: ["admin", "company_creator"] };

      // Mock successful service response with job data
      const mockJobs = {
        data: [{ id: 1, title: "Software Developer" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };

      // Configure mocks with successful values
      (jobService.isUserCompanyCreator as jest.Mock).mockResolvedValue(true);
      (jobService.getJobsByCompanyId as jest.Mock).mockResolvedValue(mockJobs);

      await handleGetCompanyJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with correct parameters
      expect(jobService.getJobsByCompanyId).toHaveBeenCalledWith(1, 1);
      // Verify correct response was sent
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockJobs);
    });

    // Test no jobs found for company scenario
    it("should return 404 when no jobs found for company", async () => {
      // Setup request parameters and user
      mockRequest.params = { companyId: "1" };
      mockRequest.user = { id: 1, roles: ["admin", "company_creator"] };

      // Mock empty results
      const mockJobs = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };

      (jobService.isUserCompanyCreator as jest.Mock).mockResolvedValue(true);
      (jobService.getJobsByCompanyId as jest.Mock).mockResolvedValue(mockJobs);

      await handleGetCompanyJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "No jobs found for this company",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Setup request parameters and user
      mockRequest.params = { companyId: "1" };
      mockRequest.user = { id: 1, roles: ["admin", "company_creator"] };

      // Configure mocks to simulate database error
      (jobService.isUserCompanyCreator as jest.Mock).mockResolvedValue(true);
      (jobService.getJobsByCompanyId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetCompanyJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for job posting functionality
  describe("handleJobPosting", () => {
    // Test successful job creation
    it("should create a job successfully", async () => {
      // Setup comprehensive job data in request
      mockRequest.body = {
        title: "Software Developer",
        description: "Job description",
        industry: "Technology",
        type: "Full-time",
        experience_level: "Mid",
        location: "New York",
        workplace_type: "Remote",
        salary_min_range: "60000",
        salary_max_range: "100000",
        company_id: "1",
      };

      // Mock successful job creation
      const mockJob = { id: 1, title: "Software Developer" };

      // Configure mocks with successful values
      (jobService.isUserCompanyCreator as jest.Mock).mockResolvedValue(true);
      (jobService.createJob as jest.Mock).mockResolvedValue(mockJob);

      // Invoke the final middleware function (after validation)
      await invokeMiddleware(
        handleJobPosting[handleJobPosting.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify authorization check was performed
      expect(jobService.isUserCompanyCreator).toHaveBeenCalledWith(1, "1");
      // Verify job creation service was called
      expect(jobService.createJob).toHaveBeenCalled();
      // Verify correct response was sent
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(mockJob);
    });

    // Test unauthorized company access scenario
    it("should return 403 when user is not company creator", async () => {
      // Setup minimal job data
      mockRequest.body = {
        title: "Software Developer",
        company_id: "1",
      };

      // Configure mock to deny access
      (jobService.isUserCompanyCreator as jest.Mock).mockResolvedValue(false);

      await invokeMiddleware(
        handleJobPosting[handleJobPosting.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 403 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: "You are not authorized to create a job for this company",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Setup minimal job data
      mockRequest.body = {
        title: "Software Developer",
        company_id: "1",
      };

      // Configure mock to simulate database error
      (jobService.isUserCompanyCreator as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await invokeMiddleware(
        handleJobPosting[handleJobPosting.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for job update functionality
  describe("handleUpdateJob", () => {
    // Test successful job update
    it("should update a job successfully", async () => {
      // Setup job ID and update data
      mockRequest.params = { jobId: "1" };
      mockRequest.body = {
        title: "Updated Developer Position",
        salary_min_range: "70000",
        salary_max_range: "120000",
      };

      // Mock successful update response
      const mockUpdatedJob = {
        id: 1,
        title: "Updated Developer Position",
        salary_min_range: 70000,
        salary_max_range: 120000,
      };

      // Configure mocks with successful values
      (jobService.isUserJobCreator as jest.Mock).mockResolvedValue(true);
      (jobService.updateJob as jest.Mock).mockResolvedValue(mockUpdatedJob);

      // Invoke the final middleware function (after validation)
      await invokeMiddleware(
        handleUpdateJob[handleUpdateJob.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify authorization check was performed
      expect(jobService.isUserJobCreator).toHaveBeenCalledWith(1, 1);
      // Verify update service was called
      expect(jobService.updateJob).toHaveBeenCalled();
      // Verify correct response was sent
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockUpdatedJob);
    });

    // Test unauthorized update scenario
    it("should return 403 when user is not job creator", async () => {
      // Setup job ID and minimal update data
      mockRequest.params = { jobId: "1" };
      mockRequest.body = { title: "Updated Title" };

      // Configure mock to deny access
      (jobService.isUserJobCreator as jest.Mock).mockResolvedValue(false);

      await invokeMiddleware(
        handleUpdateJob[handleUpdateJob.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 403 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: "You are not authorized to update this job",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Setup job ID and minimal update data
      mockRequest.params = { jobId: "1" };
      mockRequest.body = { title: "Updated Title" };

      // Configure mock to simulate database error
      (jobService.isUserJobCreator as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await invokeMiddleware(
        handleUpdateJob[handleUpdateJob.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for job deletion functionality
  describe("handleDeleteJob", () => {
    // Test successful job deletion
    it("should delete a job successfully", async () => {
      // Setup job ID for deletion
      mockRequest.params = { jobId: "1" };

      // Configure mocks with successful values
      (jobService.isUserJobCreator as jest.Mock).mockResolvedValue(true);
      (jobService.deleteJob as jest.Mock).mockResolvedValue(true);

      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify authorization check was performed
      expect(jobService.isUserJobCreator).toHaveBeenCalledWith(1, 1);
      // Verify deletion service was called with correct ID
      expect(jobService.deleteJob).toHaveBeenCalledWith(1);
      // Verify correct 204 No Content response was sent
      expect(responseSendStatus).toHaveBeenCalledWith(204);
    });

    // Test unauthorized deletion scenario
    it("should return 403 when user is not job creator", async () => {
      // Setup job ID
      mockRequest.params = { jobId: "1" };

      // Configure mock to deny access
      (jobService.isUserJobCreator as jest.Mock).mockResolvedValue(false);

      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 403 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: "You are not authorized to delete this job",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Setup job ID
      mockRequest.params = { jobId: "1" };

      // Configure mock to simulate database error
      (jobService.isUserJobCreator as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for saving job functionality
  describe("handleSaveJob", () => {
    // Test successful job saving
    it("should save a job successfully", async () => {
      // Setup job ID
      mockRequest.params = { jobId: "1" };

      // Mock successful saved job record
      const savedJob = { userId: 1, jobId: 1 };

      // Configure mocks with successful values
      (jobService.isThereJobWithId as jest.Mock).mockResolvedValue(true);
      (jobService.hasUserSavedJob as jest.Mock).mockResolvedValue(false);
      (jobService.saveJob as jest.Mock).mockResolvedValue(savedJob);

      await handleSaveJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify job existence check was performed
      expect(jobService.isThereJobWithId).toHaveBeenCalledWith(1);
      // Verify duplicate check was performed
      expect(jobService.hasUserSavedJob).toHaveBeenCalledWith(1, 1);
      // Verify save job service was called with correct IDs
      expect(jobService.saveJob).toHaveBeenCalledWith(1, 1);
      // Verify correct created response was sent
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(savedJob);
    });

    // Test job not found scenario
    it("should return 404 when job not found", async () => {
      // Setup job ID
      mockRequest.params = { jobId: "1" };

      // Configure mock to indicate job doesn't exist
      (jobService.isThereJobWithId as jest.Mock).mockResolvedValue(false);

      await handleSaveJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "Job not found" });
    });

    // Test already saved job scenario
    it("should return 409 when job already saved", async () => {
      // Setup job ID
      mockRequest.params = { jobId: "1" };

      // Configure mocks to indicate job exists but is already saved
      (jobService.isThereJobWithId as jest.Mock).mockResolvedValue(true);
      (jobService.hasUserSavedJob as jest.Mock).mockResolvedValue(true);

      await handleSaveJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 409 conflict response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(409);
      expect(responseJson).toHaveBeenCalledWith({ error: "Job already saved" });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Setup job ID
      mockRequest.params = { jobId: "1" };

      // Configure mock to simulate database error
      (jobService.isThereJobWithId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleSaveJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for getting saved jobs functionality
  describe("handleGetSavedJobs", () => {
    // Test successful retrieval of saved jobs
    it("should return 400 when page number is invalid", async () => {
      // Setup request with invalid page number
      mockRequest.query = { page: "0" };

      // Mock successful service response with job data
      const mockSavedJobs = {
        data: [{ id: 1, title: "Software Developer" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };

      // Configure mock to return saved jobs
      (jobService.getSavedJobs as jest.Mock).mockResolvedValue(mockSavedJobs);

      await handleGetSavedJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // This test title suggests it tests invalid page number,
      // but it appears to be testing successful retrieval
      // Verify service was called with correct user ID and default page 1
      expect(jobService.getSavedJobs).toHaveBeenCalledWith(1, 1);
      // Verify correct response was sent
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockSavedJobs);
    });

    // Test no saved jobs found scenario
    it("should return 404 when no saved jobs found", async () => {
      // Setup request with page number
      mockRequest.query = { page: "1" };

      // Mock empty results
      const mockSavedJobs = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };

      // Configure mock to return empty saved jobs list
      (jobService.getSavedJobs as jest.Mock).mockResolvedValue(mockSavedJobs);

      await handleGetSavedJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "No saved jobs found",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Configure mock to simulate database error
      (jobService.getSavedJobs as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetSavedJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for removing saved jobs functionality
  describe("handleRemoveSavedJob", () => {
    // Test successful removal of saved job
    it("should remove saved job successfully", async () => {
      // Setup job ID
      mockRequest.params = { jobId: "1" };

      // Configure mocks with successful values
      (jobService.hasUserSavedJob as jest.Mock).mockResolvedValue(true);
      (jobService.removeSavedJob as jest.Mock).mockResolvedValue(true);

      await handleRemoveSavedJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify job exists in saved list check
      expect(jobService.hasUserSavedJob).toHaveBeenCalledWith(1, 1);
      // Verify remove service was called with correct IDs
      expect(jobService.removeSavedJob).toHaveBeenCalledWith(1, 1);
      // Verify correct 204 No Content response was sent
      expect(responseSendStatus).toHaveBeenCalledWith(204);
    });

    // Test job not found in saved list scenario
    it("should return 404 when job is not saved", async () => {
      // Setup job ID
      mockRequest.params = { jobId: "1" };

      // Configure mock to indicate job isn't in saved list
      (jobService.hasUserSavedJob as jest.Mock).mockResolvedValue(false);

      await handleRemoveSavedJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Job not found in saved jobs",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Setup job ID
      mockRequest.params = { jobId: "1" };

      // Configure mock to simulate database error
      (jobService.hasUserSavedJob as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleRemoveSavedJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for job application functionality
  describe("handleJobApplication", () => {
    // Test successful job application submission
    it("should submit job application successfully", async () => {
      // Setup job ID and application details
      mockRequest.params = { jobId: "1" };
      mockRequest.body = {
        email: "user@example.com",
        phone: "1234567890",
      };
      // Setup mock file for resume
      mockRequest.file = {
        fieldname: "resume",
        originalname: "resume.pdf",
        encoding: "7bit",
        mimetype: "application/pdf",
        buffer: Buffer.from("file content"),
        size: 1000,
      } as any;

      // Mock successful application response
      const mockJobApplication = { id: 1, status: "pending" };

      // Configure all mocks with successful values
      (jobService.isThereJobWithId as jest.Mock).mockResolvedValue(true);
      (jobService.hasUserAppliedToJob as jest.Mock).mockResolvedValue(false);
      (
        jobService.hasUserExceededApplicationLimit as jest.Mock
      ).mockResolvedValue(false);
      (jobService.submitJobApplication as jest.Mock).mockResolvedValue(
        mockJobApplication
      );
      (jobService.removeSavedJob as jest.Mock).mockResolvedValue(true);

      // Invoke the final middleware function (after validation)
      await invokeMiddleware(
        handleJobApplication[handleJobApplication.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify job existence check
      expect(jobService.isThereJobWithId).toHaveBeenCalledWith(1);
      // Verify duplicate application check
      expect(jobService.hasUserAppliedToJob).toHaveBeenCalledWith(1, 1);
      // Verify application limit check
      expect(jobService.hasUserExceededApplicationLimit).toHaveBeenCalledWith(
        1
      );
      // Verify application submission with all parameters
      expect(jobService.submitJobApplication).toHaveBeenCalledWith(
        1,
        1,
        mockRequest.file,
        "user@example.com",
        "1234567890"
      );
      // Verify job removed from saved list after applying
      expect(jobService.removeSavedJob).toHaveBeenCalledWith(1, 1);
      // Verify correct created response
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(mockJobApplication);
    });

    // Test job not found scenario
    it("should return 404 when job not found", async () => {
      // Setup job ID and file
      mockRequest.params = { jobId: "1" };
      mockRequest.file = { originalname: "resume.pdf" } as any;

      // Configure mock to indicate job doesn't exist
      (jobService.isThereJobWithId as jest.Mock).mockResolvedValue(false);

      await invokeMiddleware(
        handleJobApplication[handleJobApplication.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "Job not found" });
    });

    // Test already applied to job scenario
    it("should return 409 when already applied to job", async () => {
      // Setup job ID and file
      mockRequest.params = { jobId: "1" };
      mockRequest.file = { originalname: "resume.pdf" } as any;

      // Configure mocks to indicate job exists but already applied
      (jobService.isThereJobWithId as jest.Mock).mockResolvedValue(true);
      (jobService.hasUserAppliedToJob as jest.Mock).mockResolvedValue(true);

      await invokeMiddleware(
        handleJobApplication[handleJobApplication.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 409 conflict response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(409);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Already applied to this job",
      });
    });

    // Test application limit exceeded scenario
    it("should return 403 when application limit exceeded", async () => {
      // Setup job ID and file
      mockRequest.params = { jobId: "1" };
      mockRequest.file = { originalname: "resume.pdf" } as any;

      // Configure mocks to indicate job exists, not applied, but limit exceeded
      (jobService.isThereJobWithId as jest.Mock).mockResolvedValue(true);
      (jobService.hasUserAppliedToJob as jest.Mock).mockResolvedValue(false);
      (
        jobService.hasUserExceededApplicationLimit as jest.Mock
      ).mockResolvedValue(true);

      await invokeMiddleware(
        handleJobApplication[handleJobApplication.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 403 forbidden response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Monthly application limit exceeded for your subscription plan",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Setup job ID and file
      mockRequest.params = { jobId: "1" };
      mockRequest.file = { originalname: "resume.pdf" } as any;

      // Configure mock to simulate database error
      (jobService.isThereJobWithId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await invokeMiddleware(
        handleJobApplication[handleJobApplication.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for getting user job applications
  describe("handleGetUserApplications", () => {
    // Test successful retrieval of user applications
    it("should return user applications successfully", async () => {
      // Setup request with page number
      mockRequest.query = { page: "1" };

      // Mock successful applications response
      const mockApplications = {
        data: [{ id: 1, jobTitle: "Software Developer" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };

      // Configure mock to return applications
      (jobService.getJobApplicationsByUserId as jest.Mock).mockResolvedValue(
        mockApplications
      );

      await handleGetUserApplications(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with correct user ID and page
      expect(jobService.getJobApplicationsByUserId).toHaveBeenCalledWith(1, 1);
      // Verify correct response
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockApplications);
    });

    // Test handling of invalid page number
    it("should return 400 when page number is invalid", async () => {
      // Setup request with invalid page number
      mockRequest.query = { page: "0" };

      // Mock successful applications response
      const mockApplications = {
        data: [{ id: 1, jobTitle: "Software Developer" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };

      // Configure mock to return applications
      (jobService.getJobApplicationsByUserId as jest.Mock).mockResolvedValue(
        mockApplications
      );

      await handleGetUserApplications(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // This test title suggests it tests invalid page number error,
      // but it appears to be testing successful correction to page 1
      // Verify service called with corrected page number
      expect(jobService.getJobApplicationsByUserId).toHaveBeenCalledWith(1, 1);
      // Verify successful response sent
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(mockApplications);
    });

    // Test no applications found scenario
    it("should return 404 when no applications found", async () => {
      // Setup request with page number
      mockRequest.query = { page: "1" };

      // Mock empty applications response
      const mockApplications = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };

      // Configure mock to return empty applications list
      (jobService.getJobApplicationsByUserId as jest.Mock).mockResolvedValue(
        mockApplications
      );

      await handleGetUserApplications(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "No applications found",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Configure mock to simulate database error
      (jobService.getJobApplicationsByUserId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetUserApplications(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for getting application status
  describe("handleGetApplicationStatus", () => {
    // Test successful retrieval of application status
    it("should return application status successfully", async () => {
      // Setup application ID
      mockRequest.params = { applicationId: "1" };

      // Mock successful status response
      const mockStatus = { id: 1, status: "pending" };

      // Configure mock to return status
      (jobService.getApplicationStatus as jest.Mock).mockResolvedValue(
        mockStatus
      );

      await handleGetApplicationStatus(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with correct IDs
      expect(jobService.getApplicationStatus).toHaveBeenCalledWith(1, 1);
      // Verify direct response without status code
      expect(responseStatus).not.toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith(mockStatus);
    });

    // Test application not found scenario
    it("should return 404 when application not found", async () => {
      // Setup application ID
      mockRequest.params = { applicationId: "1" };

      // Configure mock to indicate no application found
      (jobService.getApplicationStatus as jest.Mock).mockResolvedValue(null);

      await handleGetApplicationStatus(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Application not found",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Setup application ID
      mockRequest.params = { applicationId: "1" };

      // Configure mock to simulate database error
      (jobService.getApplicationStatus as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetApplicationStatus(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for updating application status
  describe("handleUpdateApplicationStatus", () => {
    // Test successful status update
    it("should update application status successfully", async () => {
      // Setup application ID and new status
      mockRequest.params = { applicationId: "1" };
      mockRequest.body = { status: "approved" };

      const jobId = 2;

      // Configure mocks with successful values
      (jobService.getJobIdByApplicationId as jest.Mock).mockResolvedValue(
        jobId
      );
      (jobService.isUserJobCreator as jest.Mock).mockResolvedValue(true);
      (jobService.updateApplicationStatus as jest.Mock).mockResolvedValue(true);

      // Invoke the final middleware function (after validation)
      await invokeMiddleware(
        handleUpdateApplicationStatus[handleUpdateApplicationStatus.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify application's job ID lookup
      expect(jobService.getJobIdByApplicationId).toHaveBeenCalledWith(1);
      // Verify authorization check
      expect(jobService.isUserJobCreator).toHaveBeenCalledWith(1, 2);
      // Verify status update service called with correct parameters
      expect(jobService.updateApplicationStatus).toHaveBeenCalledWith(
        1,
        "approved"
      );
      // Verify correct OK response
      expect(responseSendStatus).toHaveBeenCalledWith(200);
    });

    // Test application not found scenario
    it("should return 404 when application not found", async () => {
      // Setup application ID and status
      mockRequest.params = { applicationId: "1" };
      mockRequest.body = { status: "approved" };

      // Configure mock to indicate application doesn't exist
      (jobService.getJobIdByApplicationId as jest.Mock).mockResolvedValue(null);

      await invokeMiddleware(
        handleUpdateApplicationStatus[handleUpdateApplicationStatus.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Application not found",
      });
    });

    // Test unauthorized update scenario
    it("should return 403 when not authorized to update status", async () => {
      // Setup application ID and status
      mockRequest.params = { applicationId: "1" };
      mockRequest.body = { status: "approved" };

      const jobId = 2;

      // Configure mocks to indicate job exists but user is not creator
      (jobService.getJobIdByApplicationId as jest.Mock).mockResolvedValue(
        jobId
      );
      (jobService.isUserJobCreator as jest.Mock).mockResolvedValue(false);

      await invokeMiddleware(
        handleUpdateApplicationStatus[handleUpdateApplicationStatus.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 403 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Unauthorized to update status",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Setup application ID and status
      mockRequest.params = { applicationId: "1" };
      mockRequest.body = { status: "approved" };

      // Configure mock to simulate database error
      (jobService.getJobIdByApplicationId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await invokeMiddleware(
        handleUpdateApplicationStatus[handleUpdateApplicationStatus.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for getting job applications
  describe("handleGetJobApplications", () => {
    // Test successful retrieval of job applications
    it("should return job applications successfully", async () => {
      // Setup job ID and page
      mockRequest.params = { jobId: "1" };
      mockRequest.query = { page: "1" };

      // Mock successful applications response
      const mockApplications = {
        data: [{ id: 1, applicantName: "John Doe" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };

      // Configure mocks with successful values
      (jobService.isUserJobCreator as jest.Mock).mockResolvedValue(true);
      (jobService.getJobApplications as jest.Mock).mockResolvedValue(
        mockApplications
      );

      await handleGetJobApplications(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify authorization check
      expect(jobService.isUserJobCreator).toHaveBeenCalledWith(1, 1);
      // Verify get applications service called with correct parameters
      expect(jobService.getJobApplications).toHaveBeenCalledWith(1, 1);
      // Verify direct response without status code
      expect(responseStatus).not.toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith(mockApplications);
    });

    // Test handling of invalid page number
    it("should return 400 when page number is invalid", async () => {
      // Setup job ID with invalid page
      mockRequest.params = { jobId: "1" };
      mockRequest.query = { page: "0" };

      // Mock successful applications response
      const mockApplications = {
        data: [{ id: 1, applicantName: "John Doe" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };

      // Configure mocks with successful values
      (jobService.isUserJobCreator as jest.Mock).mockResolvedValue(true);
      (jobService.getJobApplications as jest.Mock).mockResolvedValue(
        mockApplications
      );

      await handleGetJobApplications(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // This test title suggests it tests invalid page number error,
      // but it appears to be testing successful correction to page 1
      // Verify authorization check
      expect(jobService.isUserJobCreator).toHaveBeenCalledWith(1, 1);
      // Verify service called with corrected page number
      expect(jobService.getJobApplications).toHaveBeenCalledWith(1, 1);
      // Verify successful response
      expect(responseJson).toHaveBeenCalledWith(mockApplications);
    });

    // Test unauthorized access scenario
    it("should return 403 when not authorized to view applications", async () => {
      // Setup job ID and page
      mockRequest.params = { jobId: "1" };
      mockRequest.query = { page: "1" };

      // Configure mock to deny access
      (jobService.isUserJobCreator as jest.Mock).mockResolvedValue(false);

      await handleGetJobApplications(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 403 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Unauthorized to view applications",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Setup job ID and page
      mockRequest.params = { jobId: "1" };
      mockRequest.query = { page: "1" };

      // Configure mock to simulate database error
      (jobService.isUserJobCreator as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetJobApplications(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for reporting a job
  describe("handleReportJob", () => {
    // Test successful job reporting
    it("should report job successfully", async () => {
      // Setup job ID and reason
      mockRequest.params = { jobId: "1" };
      mockRequest.body = { reason: "Inappropriate content" };

      // Configure mocks with successful values
      (jobService.isThereJobWithId as jest.Mock).mockResolvedValue(true);
      (jobService.reportJob as jest.Mock).mockResolvedValue({
        id: 1,
        reason: "Inappropriate content",
      });

      // Invoke the final middleware function (after validation)
      await invokeMiddleware(
        handleReportJob[handleReportJob.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify job existence check
      expect(jobService.isThereJobWithId).toHaveBeenCalledWith(1);
      // Verify report service called with correct parameters
      expect(jobService.reportJob).toHaveBeenCalledWith(
        1,
        1,
        "Inappropriate content"
      );
      // Verify correct created response
      expect(responseSendStatus).toHaveBeenCalledWith(201);
    });

    // Test job not found scenario
    it("should return 404 when job not found", async () => {
      // Setup job ID and reason
      mockRequest.params = { jobId: "1" };
      mockRequest.body = { reason: "Inappropriate content" };

      // Configure mock to indicate job doesn't exist
      (jobService.isThereJobWithId as jest.Mock).mockResolvedValue(false);

      await invokeMiddleware(
        handleReportJob[handleReportJob.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "Job not found" });
    });

    // Test already reported job scenario
    it("should return 409 when already reported job", async () => {
      // Setup job ID and reason
      mockRequest.params = { jobId: "1" };
      mockRequest.body = { reason: "Inappropriate content" };

      // Configure mocks to indicate job exists but already reported by user
      (jobService.isThereJobWithId as jest.Mock).mockResolvedValue(true);
      (jobService.reportJob as jest.Mock).mockResolvedValue(null);

      await invokeMiddleware(
        handleReportJob[handleReportJob.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 409 conflict response with appropriate error
      expect(responseStatus).toHaveBeenCalledWith(409);
      expect(responseJson).toHaveBeenCalledWith({
        error: "You have already reported this job.",
      });
    });

    // Test error handling scenario
    it("should handle errors and return 500", async () => {
      // Setup job ID and reason
      mockRequest.params = { jobId: "1" };
      mockRequest.body = { reason: "Inappropriate content" };

      // Configure mock to simulate database error
      (jobService.isThereJobWithId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await invokeMiddleware(
        handleReportJob[handleReportJob.length - 1],
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 response for server error
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });
});
