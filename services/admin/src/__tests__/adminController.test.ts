import { Response } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import * as adminService from "../services/adminService";
import {
  handleGetReportedJobs,
  handleGetJobReports,
  handleUpdateJobReport,
  handleDeleteJob,
  handleGetJobReportsCount,
  handleGetJobsCount,
  handleGetUsersCount,
  handleGetPostsCount,
  handleGetConnectionsCount,
  handleGetFollowsCount,
  handleGetReportedPosts,
  handleGetPostReports,
  handleUpdatePostReport,
  handleDeletePost,
  handleGetPostReportsCount,
  handleGetSubscriptionsCount,
} from "../controllers/adminController";

// Mock the adminService module to control its behavior during testing
jest.mock("../services/adminService", () => ({
  getReportedJobs: jest.fn(),
  getJobReports: jest.fn(),
  updateJobReportStatus: jest.fn(),
  deleteJob: jest.fn(),
  getJobReportsCount: jest.fn(),
  getJobsCount: jest.fn(),
  getUsersCount: jest.fn(),
  getPostsCount: jest.fn(),
  getConnectionsCount: jest.fn(),
  getFollowsCount: jest.fn(),
  getReportedPosts: jest.fn(),
  getPostReports: jest.fn(),
  updatePostReportStatus: jest.fn(),
  deletePost: jest.fn(),
  getPostReportsCount: jest.fn(),
  getSubscriptionsCount: jest.fn(),
  isThereJobReportWithId: jest.fn(),
  isThereJobWithId: jest.fn(),
  isTherePostReportWithId: jest.fn(),
  isTherePostWithId: jest.fn(),
}));

// Main test suite for Admin Controller functionality
describe("Admin Controller", () => {
  // Define variables for request/response mocking
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let responseSendStatus: jest.Mock;

  // Setup before each test
  beforeEach(() => {
    // Create mock functions for response methods
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnThis();
    responseSendStatus = jest.fn().mockReturnThis();

    // Setup mock request with default values
    mockRequest = {
      query: {},
      params: {},
      body: {},
      user: { id: 1 },
    };

    // Setup mock response with mock methods
    mockResponse = {
      json: responseJson,
      status: responseStatus,
      sendStatus: responseSendStatus,
    };

    // Clear all mock function calls before each test
    jest.clearAllMocks();
  });

  // Test suite for handleGetReportedJobs controller method
  describe("handleGetReportedJobs", () => {
    // Test for successful retrieval of reported jobs
    it("should return reported jobs successfully", async () => {
      // Mock data to be returned by service
      const mockReportedJobs = {
        data: [{ id: 1, title: "Job 1" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };
      // Configure mock to return test data
      (adminService.getReportedJobs as jest.Mock).mockResolvedValue(
        mockReportedJobs
      );

      // Call the controller function
      await handleGetReportedJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service was called with correct params
      expect(adminService.getReportedJobs).toHaveBeenCalledWith(1);
      // Verify response sent correct data
      expect(responseJson).toHaveBeenCalledWith(mockReportedJobs);
    });

    // Test for empty results (404 case)
    it("should return 404 when no reported jobs found", async () => {
      // Mock empty result set
      const mockReportedJobs = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };
      (adminService.getReportedJobs as jest.Mock).mockResolvedValue(
        mockReportedJobs
      );

      await handleGetReportedJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service call
      expect(adminService.getReportedJobs).toHaveBeenCalledWith(1);
      // Verify correct error status and message
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "No reported jobs found",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      // Simulate database error
      (adminService.getReportedJobs as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetReportedJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify error handling with 500 status
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleGetJobReports controller method
  describe("handleGetJobReports", () => {
    // Test for successful retrieval of job reports
    it("should return job reports successfully", async () => {
      // Set job ID parameter
      mockRequest.params = { jobId: "1" };
      // Mock successful response data
      const mockJobReports = {
        data: [{ id: 1, reason: "Inappropriate" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };
      (adminService.getJobReports as jest.Mock).mockResolvedValue(
        mockJobReports
      );

      await handleGetJobReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with correct params
      expect(adminService.getJobReports).toHaveBeenCalledWith(1, 1);
      // Verify correct response data
      expect(responseJson).toHaveBeenCalledWith(mockJobReports);
    });

    // Test for empty results (404 case)
    it("should return 404 when no job reports found", async () => {
      mockRequest.params = { jobId: "1" };
      // Mock empty result set
      const mockJobReports = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };
      (adminService.getJobReports as jest.Mock).mockResolvedValue(
        mockJobReports
      );

      await handleGetJobReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 status and error message
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "No reports found for this job",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      mockRequest.params = { jobId: "1" };
      // Simulate database error
      (adminService.getJobReports as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetJobReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 error response
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleUpdateJobReport controller method
  describe("handleUpdateJobReport", () => {
    // Test for successful update of job report status
    it("should update job report status successfully", async () => {
      // Set report ID and status in request
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      // Mock report existence check and update success
      (adminService.isThereJobReportWithId as jest.Mock).mockResolvedValue(
        true
      );
      (adminService.updateJobReportStatus as jest.Mock).mockResolvedValue(true);

      await handleUpdateJobReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service calls with correct parameters
      expect(adminService.isThereJobReportWithId).toHaveBeenCalledWith(1);
      expect(adminService.updateJobReportStatus).toHaveBeenCalledWith(
        1,
        "resolved"
      );
      // Verify 200 status response
      expect(responseSendStatus).toHaveBeenCalledWith(200);
    });

    // Test for report not found (404 case)
    it("should return 404 when report not found", async () => {
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      // Mock report not found
      (adminService.isThereJobReportWithId as jest.Mock).mockResolvedValue(
        false
      );

      await handleUpdateJobReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 status and error message
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "Report not found" });
    });

    // Test for invalid status input (400 case)
    it("should return 400 when invalid status provided", async () => {
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "invalid_status" };

      // Mock report existence
      (adminService.isThereJobReportWithId as jest.Mock).mockResolvedValue(
        true
      );

      await handleUpdateJobReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Invalid status value",
      });
    });

    // Test for update failure (500 case)
    it("should return 500 when update fails", async () => {
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      // Mock report existence but update failure
      (adminService.isThereJobReportWithId as jest.Mock).mockResolvedValue(
        true
      );
      (adminService.updateJobReportStatus as jest.Mock).mockResolvedValue(
        false
      );

      await handleUpdateJobReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Failed to update report",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      // Simulate database error
      (adminService.isThereJobReportWithId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleUpdateJobReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify general 500 error response
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleDeleteJob controller method
  describe("handleDeleteJob", () => {
    // Test for successful job deletion
    it("should delete job successfully", async () => {
      // Set job ID in request
      mockRequest.params = { jobId: "1" };

      // Mock job existence and successful deletion
      (adminService.isThereJobWithId as jest.Mock).mockResolvedValue(true);
      (adminService.deleteJob as jest.Mock).mockResolvedValue(true);

      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service calls with correct parameters
      expect(adminService.isThereJobWithId).toHaveBeenCalledWith(1);
      expect(adminService.deleteJob).toHaveBeenCalledWith(1);
      // Verify 200 status response
      expect(responseSendStatus).toHaveBeenCalledWith(200);
    });

    // Test for invalid job ID format (400 case)
    it("should return 400 when invalid job ID provided", async () => {
      // Set non-numeric job ID
      mockRequest.params = { jobId: "invalid" };

      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: "Invalid job ID" });
    });

    // Test for job not found (404 case)
    it("should return 404 when job not found", async () => {
      mockRequest.params = { jobId: "1" };

      // Mock job not found
      (adminService.isThereJobWithId as jest.Mock).mockResolvedValue(false);

      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 status and error message
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "Job not found" });
    });

    // Test for deletion failure (500 case)
    it("should return 500 when deletion fails", async () => {
      mockRequest.params = { jobId: "1" };

      // Mock job existence but deletion failure
      (adminService.isThereJobWithId as jest.Mock).mockResolvedValue(true);
      (adminService.deleteJob as jest.Mock).mockResolvedValue(false);

      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Failed to delete job",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      mockRequest.params = { jobId: "1" };

      // Simulate database error
      (adminService.isThereJobWithId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify general 500 error response
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleGetJobReportsCount controller method
  describe("handleGetJobReportsCount", () => {
    // Test for getting count without duration filter
    it("should return job reports count without duration filter", async () => {
      // Mock service to return count
      (adminService.getJobReportsCount as jest.Mock).mockResolvedValue(10);

      await handleGetJobReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with undefined duration
      expect(adminService.getJobReportsCount).toHaveBeenCalledWith(undefined);
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 10 });
    });

    // Test for getting count with valid duration filter
    it("should return job reports count with valid duration filter", async () => {
      // Set day duration in request
      mockRequest.query = { duration: "day" };
      (adminService.getJobReportsCount as jest.Mock).mockResolvedValue(5);

      await handleGetJobReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with day duration
      expect(adminService.getJobReportsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 5 });
    });

    // Test for invalid duration parameter (400 case)
    it("should return 400 when invalid duration provided", async () => {
      // Set invalid duration
      mockRequest.query = { duration: "invalid" };

      await handleGetJobReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      // Simulate database error
      (adminService.getJobReportsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetJobReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleGetJobsCount controller method
  describe("handleGetJobsCount", () => {
    // Test for getting count without duration filter
    it("should return jobs count without duration filter", async () => {
      // Mock service to return total count
      (adminService.getJobsCount as jest.Mock).mockResolvedValue(100);

      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with undefined duration
      expect(adminService.getJobsCount).toHaveBeenCalledWith(undefined);
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 100 });
    });

    // Test for getting count with day duration filter
    it("should return jobs count with valid day duration filter", async () => {
      // Set day duration in request
      mockRequest.query = { duration: "day" };
      (adminService.getJobsCount as jest.Mock).mockResolvedValue(5);

      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getJobsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 5 });
    });

    // Test for getting count with week duration filter
    it("should return jobs count with valid week duration filter", async () => {
      // Set week duration in request
      mockRequest.query = { duration: "week" };
      (adminService.getJobsCount as jest.Mock).mockResolvedValue(35);

      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getJobsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 35 });
    });

    // Test for getting count with month duration filter
    it("should return jobs count with valid month duration filter", async () => {
      // Set month duration in request
      mockRequest.query = { duration: "month" };
      (adminService.getJobsCount as jest.Mock).mockResolvedValue(150);

      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getJobsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 150 });
    });

    // Test for getting count with year duration filter
    it("should return jobs count with valid year duration filter", async () => {
      // Set year duration in request
      mockRequest.query = { duration: "year" };
      (adminService.getJobsCount as jest.Mock).mockResolvedValue(1200);

      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getJobsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 1200 });
    });

    // Test for invalid duration parameter (400 case)
    it("should return 400 when invalid duration provided", async () => {
      // Set invalid duration
      mockRequest.query = { duration: "invalid" };

      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      // Simulate database error
      (adminService.getJobsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleGetUsersCount controller method
  describe("handleGetUsersCount", () => {
    // Test for getting count without duration filter
    it("should return users count without duration filter", async () => {
      // Mock service to return total count
      (adminService.getUsersCount as jest.Mock).mockResolvedValue(500);

      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with undefined duration
      expect(adminService.getUsersCount).toHaveBeenCalledWith(undefined);
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 500 });
    });

    // Test for getting count with day duration filter
    it("should return users count with valid day duration filter", async () => {
      // Set day duration in request
      mockRequest.query = { duration: "day" };
      (adminService.getUsersCount as jest.Mock).mockResolvedValue(10);

      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getUsersCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 10 });
    });

    // Test for getting count with week duration filter
    it("should return users count with valid week duration filter", async () => {
      // Set week duration in request
      mockRequest.query = { duration: "week" };
      (adminService.getUsersCount as jest.Mock).mockResolvedValue(70);

      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getUsersCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 70 });
    });

    // Test for getting count with month duration filter
    it("should return users count with valid month duration filter", async () => {
      // Set month duration in request
      mockRequest.query = { duration: "month" };
      (adminService.getUsersCount as jest.Mock).mockResolvedValue(300);

      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getUsersCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 300 });
    });

    // Test for getting count with year duration filter
    it("should return users count with valid year duration filter", async () => {
      // Set year duration in request
      mockRequest.query = { duration: "year" };
      (adminService.getUsersCount as jest.Mock).mockResolvedValue(3600);

      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getUsersCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 3600 });
    });

    // Test for invalid duration parameter (400 case)
    it("should return 400 when invalid duration provided", async () => {
      // Set invalid duration
      mockRequest.query = { duration: "invalid" };

      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      // Simulate database error
      (adminService.getUsersCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleGetPostsCount controller method
  describe("handleGetPostsCount", () => {
    // Test for getting count without duration filter
    it("should return posts count without duration filter", async () => {
      // Mock service to return total count
      (adminService.getPostsCount as jest.Mock).mockResolvedValue(1000);

      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with undefined duration
      expect(adminService.getPostsCount).toHaveBeenCalledWith(undefined);
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 1000 });
    });

    // Test for getting count with day duration filter
    it("should return posts count with valid day duration filter", async () => {
      // Set day duration in request
      mockRequest.query = { duration: "day" };
      (adminService.getPostsCount as jest.Mock).mockResolvedValue(25);

      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getPostsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 25 });
    });

    // Test for getting count with week duration filter
    it("should return posts count with valid week duration filter", async () => {
      // Set week duration in request
      mockRequest.query = { duration: "week" };
      (adminService.getPostsCount as jest.Mock).mockResolvedValue(175);

      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getPostsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 175 });
    });

    // Test for getting count with month duration filter
    it("should return posts count with valid month duration filter", async () => {
      // Set month duration in request
      mockRequest.query = { duration: "month" };
      (adminService.getPostsCount as jest.Mock).mockResolvedValue(750);

      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getPostsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 750 });
    });

    // Test for getting count with year duration filter
    it("should return posts count with valid year duration filter", async () => {
      // Set year duration in request
      mockRequest.query = { duration: "year" };
      (adminService.getPostsCount as jest.Mock).mockResolvedValue(9000);

      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getPostsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 9000 });
    });

    // Test for invalid duration parameter (400 case)
    it("should return 400 when invalid duration provided", async () => {
      // Set invalid duration
      mockRequest.query = { duration: "invalid" };

      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      // Simulate database error
      (adminService.getPostsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleGetConnectionsCount controller method
  describe("handleGetConnectionsCount", () => {
    // Test for getting count without duration filter
    it("should return connections count without duration filter", async () => {
      // Mock service to return total count
      (adminService.getConnectionsCount as jest.Mock).mockResolvedValue(800);

      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with undefined duration
      expect(adminService.getConnectionsCount).toHaveBeenCalledWith(undefined);
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 800 });
    });

    // Test for getting count with day duration filter
    it("should return connections count with valid day duration filter", async () => {
      // Set day duration in request
      mockRequest.query = { duration: "day" };
      (adminService.getConnectionsCount as jest.Mock).mockResolvedValue(15);

      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getConnectionsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 15 });
    });

    // Test for getting count with week duration filter
    it("should return connections count with valid week duration filter", async () => {
      // Set week duration in request
      mockRequest.query = { duration: "week" };
      (adminService.getConnectionsCount as jest.Mock).mockResolvedValue(105);

      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getConnectionsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 105 });
    });

    // Test for getting count with month duration filter
    it("should return connections count with valid month duration filter", async () => {
      // Set month duration in request
      mockRequest.query = { duration: "month" };
      (adminService.getConnectionsCount as jest.Mock).mockResolvedValue(450);

      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getConnectionsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 450 });
    });

    // Test for getting count with year duration filter
    it("should return connections count with valid year duration filter", async () => {
      // Set year duration in request
      mockRequest.query = { duration: "year" };
      (adminService.getConnectionsCount as jest.Mock).mockResolvedValue(5400);

      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getConnectionsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 5400 });
    });

    // Test for invalid duration parameter (400 case)
    it("should return 400 when invalid duration provided", async () => {
      // Set invalid duration
      mockRequest.query = { duration: "invalid" };

      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      // Simulate database error
      (adminService.getConnectionsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleGetFollowsCount controller method
  describe("handleGetFollowsCount", () => {
    // Test for getting count without duration filter
    it("should return follows count without duration filter", async () => {
      // Mock service to return total count
      (adminService.getFollowsCount as jest.Mock).mockResolvedValue(1200);

      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with undefined duration
      expect(adminService.getFollowsCount).toHaveBeenCalledWith(undefined);
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 1200 });
    });

    // Test for getting count with day duration filter
    it("should return follows count with valid day duration filter", async () => {
      // Set day duration in request
      mockRequest.query = { duration: "day" };
      (adminService.getFollowsCount as jest.Mock).mockResolvedValue(20);

      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getFollowsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 20 });
    });

    // Test for getting count with week duration filter
    it("should return follows count with valid week duration filter", async () => {
      // Set week duration in request
      mockRequest.query = { duration: "week" };
      (adminService.getFollowsCount as jest.Mock).mockResolvedValue(140);

      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getFollowsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 140 });
    });

    // Test for getting count with month duration filter
    it("should return follows count with valid month duration filter", async () => {
      // Set month duration in request
      mockRequest.query = { duration: "month" };
      (adminService.getFollowsCount as jest.Mock).mockResolvedValue(600);

      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getFollowsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 600 });
    });

    // Test for getting count with year duration filter
    it("should return follows count with valid year duration filter", async () => {
      // Set year duration in request
      mockRequest.query = { duration: "year" };
      (adminService.getFollowsCount as jest.Mock).mockResolvedValue(7200);

      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getFollowsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 7200 });
    });

    // Test for invalid duration parameter (400 case)
    it("should return 400 when invalid duration provided", async () => {
      // Set invalid duration
      mockRequest.query = { duration: "invalid" };

      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      // Simulate database error
      (adminService.getFollowsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleGetReportedPosts controller method
  describe("handleGetReportedPosts", () => {
    // Test for successful retrieval of reported posts
    it("should return reported posts successfully", async () => {
      // Mock successful response data
      const mockReportedPosts = {
        data: [{ id: 1, content: "Post 1" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };
      (adminService.getReportedPosts as jest.Mock).mockResolvedValue(
        mockReportedPosts
      );

      await handleGetReportedPosts(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with correct parameters
      expect(adminService.getReportedPosts).toHaveBeenCalledWith(1);
      // Verify correct response data
      expect(responseJson).toHaveBeenCalledWith(mockReportedPosts);
    });

    // Test for empty results (404 case)
    it("should return 404 when no reported posts found", async () => {
      // Mock empty result set
      const mockReportedPosts = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };
      (adminService.getReportedPosts as jest.Mock).mockResolvedValue(
        mockReportedPosts
      );

      await handleGetReportedPosts(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with correct parameters
      expect(adminService.getReportedPosts).toHaveBeenCalledWith(1);
      // Verify 404 status and error message
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "No reported posts found",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      // Simulate database error
      (adminService.getReportedPosts as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetReportedPosts(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleGetPostReports controller method
  describe("handleGetPostReports", () => {
    // Test for successful retrieval of post reports
    it("should return post reports successfully", async () => {
      // Set post ID in request
      mockRequest.params = { postId: "1" };
      // Mock successful response data
      const mockPostReports = {
        data: [{ id: 1, reason: "Inappropriate" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };
      (adminService.getPostReports as jest.Mock).mockResolvedValue(
        mockPostReports
      );

      await handleGetPostReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with correct parameters
      expect(adminService.getPostReports).toHaveBeenCalledWith(1, 1);
      // Verify correct response data
      expect(responseJson).toHaveBeenCalledWith(mockPostReports);
    });

    // Test for empty results (404 case)
    it("should return 404 when no post reports found", async () => {
      mockRequest.params = { postId: "1" };
      // Mock empty result set
      const mockPostReports = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };
      (adminService.getPostReports as jest.Mock).mockResolvedValue(
        mockPostReports
      );

      await handleGetPostReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 status and error message
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "No reports found for this post",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      mockRequest.params = { postId: "1" };
      // Simulate database error
      (adminService.getPostReports as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetPostReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleDeletePost controller method
  describe("handleDeletePost", () => {
    // Test for successful post deletion
    it("should delete post successfully", async () => {
      // Set post ID in request
      mockRequest.params = { postId: "1" };

      // Mock post existence and successful deletion
      (adminService.isTherePostWithId as jest.Mock).mockResolvedValue(true);
      (adminService.deletePost as jest.Mock).mockResolvedValue(true);

      await handleDeletePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service calls with correct parameters
      expect(adminService.isTherePostWithId).toHaveBeenCalledWith(1);
      expect(adminService.deletePost).toHaveBeenCalledWith(1);
      // Verify 200 status response
      expect(responseSendStatus).toHaveBeenCalledWith(200);
    });

    // Test for invalid post ID format (400 case)
    it("should return 400 when invalid post ID provided", async () => {
      // Set non-numeric post ID
      mockRequest.params = { postId: "invalid" };

      await handleDeletePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: "Invalid post ID" });
    });

    // Test for post not found (404 case)
    it("should return 404 when post not found", async () => {
      mockRequest.params = { postId: "1" };

      // Mock post not found
      (adminService.isTherePostWithId as jest.Mock).mockResolvedValue(false);

      await handleDeletePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 status and error message
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "Post not found" });
    });

    // Test for deletion failure (500 case)
    it("should return 500 when deletion fails", async () => {
      mockRequest.params = { postId: "1" };

      // Mock post existence but deletion failure
      (adminService.isTherePostWithId as jest.Mock).mockResolvedValue(true);
      (adminService.deletePost as jest.Mock).mockResolvedValue(false);

      await handleDeletePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Failed to delete post",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      mockRequest.params = { postId: "1" };

      // Simulate database error
      (adminService.isTherePostWithId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleDeletePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleGetPostReportsCount controller method
  describe("handleGetPostReportsCount", () => {
    // Test for getting count without duration filter
    it("should return post reports count without duration filter", async () => {
      // Mock service to return total count
      (adminService.getPostReportsCount as jest.Mock).mockResolvedValue(50);

      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with undefined duration
      expect(adminService.getPostReportsCount).toHaveBeenCalledWith(undefined);
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 50 });
    });

    // Test for getting count with day duration filter
    it("should return post reports count with valid day duration filter", async () => {
      // Set day duration in request
      mockRequest.query = { duration: "day" };
      (adminService.getPostReportsCount as jest.Mock).mockResolvedValue(3);

      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getPostReportsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 3 });
    });

    // Test for getting count with week duration filter
    it("should return post reports count with valid week duration filter", async () => {
      // Set week duration in request
      mockRequest.query = { duration: "week" };
      (adminService.getPostReportsCount as jest.Mock).mockResolvedValue(21);

      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getPostReportsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 21 });
    });

    // Test for getting count with month duration filter
    it("should return post reports count with valid month duration filter", async () => {
      // Set month duration in request
      mockRequest.query = { duration: "month" };
      (adminService.getPostReportsCount as jest.Mock).mockResolvedValue(90);

      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getPostReportsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 90 });
    });

    // Test for getting count with year duration filter
    it("should return post reports count with valid year duration filter", async () => {
      // Set year duration in request
      mockRequest.query = { duration: "year" };
      (adminService.getPostReportsCount as jest.Mock).mockResolvedValue(1080);

      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getPostReportsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 1080 });
    });

    // Test for invalid duration parameter (400 case)
    it("should return 400 when invalid duration provided", async () => {
      // Set invalid duration
      mockRequest.query = { duration: "invalid" };

      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      // Simulate database error
      (adminService.getPostReportsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test suite for handleUpdatePostReport controller method
  describe("handleUpdatePostReport", () => {
    // Test for successful update of post report status
    it("should update post report status successfully", async () => {
      // Set report ID and status in request
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved", comment: "This has been fixed" };

      // Mock report existence check and update success
      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        true
      );
      (adminService.updatePostReportStatus as jest.Mock).mockResolvedValue(
        true
      );

      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service calls with correct parameters
      expect(adminService.isTherePostReportWithId).toHaveBeenCalledWith(1);
      expect(adminService.updatePostReportStatus).toHaveBeenCalledWith(
        1,
        "resolved",
        "This has been fixed"
      );
      // Verify 200 status response
      expect(responseSendStatus).toHaveBeenCalledWith(200);
    });

    // Test for report not found (404 case)
    it("should return 404 when report not found", async () => {
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      // Mock report not found
      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        false
      );

      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 status and error message
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "Report not found" });
    });

    // Test for invalid status input (400 case)
    it("should return 400 when invalid status provided", async () => {
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "invalid_status" };

      // Mock report existence
      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        true
      );

      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Invalid status value",
      });
    });

    // Test for invalid comment format (400 case)
    it("should return 400 when admin comment is invalid", async () => {
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved", comment: {} };

      // Mock report existence
      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        true
      );

      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Invalid admin comment",
      });
    });

    // Test for empty comment validation (400 case)
    it("should return 400 when admin comment is empty", async () => {
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved", comment: "   " };

      // Mock report existence
      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        true
      );

      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Admin comment cannot be empty",
      });
    });

    // Test for update failure (500 case)
    it("should return 500 when update fails", async () => {
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      // Mock report existence but update failure
      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        true
      );
      (adminService.updatePostReportStatus as jest.Mock).mockResolvedValue(
        false
      );

      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Failed to update report",
      });
    });
  });

  // Test suite for handleGetSubscriptionsCount controller method
  describe("handleGetSubscriptionsCount", () => {
    // Test for getting count without duration filter
    it("should return subscriptions count without duration filter", async () => {
      // Mock service to return total count
      (adminService.getSubscriptionsCount as jest.Mock).mockResolvedValue(15);

      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called with undefined duration
      expect(adminService.getSubscriptionsCount).toHaveBeenCalledWith(
        undefined
      );
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 15 });
    });

    // Test for getting count with day duration filter
    it("should return subscriptions count with valid day duration filter", async () => {
      // Set day duration in request
      mockRequest.query = { duration: "day" };
      (adminService.getSubscriptionsCount as jest.Mock).mockResolvedValue(2);

      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getSubscriptionsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 2 });
    });

    // Test for getting count with week duration filter
    it("should return subscriptions count with valid week duration filter", async () => {
      // Set week duration in request
      mockRequest.query = { duration: "week" };
      (adminService.getSubscriptionsCount as jest.Mock).mockResolvedValue(7);

      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getSubscriptionsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 7 });
    });

    // Test for getting count with month duration filter
    it("should return subscriptions count with valid month duration filter", async () => {
      // Set month duration in request
      mockRequest.query = { duration: "month" };
      (adminService.getSubscriptionsCount as jest.Mock).mockResolvedValue(30);

      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getSubscriptionsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 30 });
    });

    // Test for getting count with year duration filter
    it("should return subscriptions count with valid year duration filter", async () => {
      // Set year duration in request
      mockRequest.query = { duration: "year" };
      (adminService.getSubscriptionsCount as jest.Mock).mockResolvedValue(365);

      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service called
      expect(adminService.getSubscriptionsCount).toHaveBeenCalled();
      // Verify correct count in response
      expect(responseJson).toHaveBeenCalledWith({ count: 365 });
    });

    // Test for invalid duration parameter (400 case)
    it("should return 400 when invalid duration provided", async () => {
      // Set invalid duration
      mockRequest.query = { duration: "decade" };

      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 400 status and error message
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    // Test for error handling
    it("should handle errors and return 500", async () => {
      // Simulate database error
      (adminService.getSubscriptionsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 500 status and error message
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });
});
