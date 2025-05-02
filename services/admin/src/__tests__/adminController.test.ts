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

// Mock implementations for adminService
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

describe("Admin Controller", () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let responseSendStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnThis();
    responseSendStatus = jest.fn().mockReturnThis();

    mockRequest = {
      query: {},
      params: {},
      body: {},
      user: { id: 1 },
    };

    mockResponse = {
      json: responseJson,
      status: responseStatus,
      sendStatus: responseSendStatus,
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("handleGetReportedJobs", () => {
    it("should return reported jobs successfully", async () => {
      // Arrange
      const mockReportedJobs = {
        data: [{ id: 1, title: "Job 1" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };
      (adminService.getReportedJobs as jest.Mock).mockResolvedValue(
        mockReportedJobs
      );

      // Act
      await handleGetReportedJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getReportedJobs).toHaveBeenCalledWith(1);
      expect(responseJson).toHaveBeenCalledWith(mockReportedJobs);
    });

    it("should return 404 when no reported jobs found", async () => {
      // Arrange
      const mockReportedJobs = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };
      (adminService.getReportedJobs as jest.Mock).mockResolvedValue(
        mockReportedJobs
      );

      // Act
      await handleGetReportedJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getReportedJobs).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "No reported jobs found",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      (adminService.getReportedJobs as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetReportedJobs(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetJobReports", () => {
    it("should return job reports successfully", async () => {
      // Arrange
      mockRequest.params = { jobId: "1" };
      const mockJobReports = {
        data: [{ id: 1, reason: "Inappropriate" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };
      (adminService.getJobReports as jest.Mock).mockResolvedValue(
        mockJobReports
      );

      // Act
      await handleGetJobReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getJobReports).toHaveBeenCalledWith(1, 1);
      expect(responseJson).toHaveBeenCalledWith(mockJobReports);
    });

    it("should return 404 when no job reports found", async () => {
      // Arrange
      mockRequest.params = { jobId: "1" };
      const mockJobReports = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };
      (adminService.getJobReports as jest.Mock).mockResolvedValue(
        mockJobReports
      );

      // Act
      await handleGetJobReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "No reports found for this job",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      mockRequest.params = { jobId: "1" };
      (adminService.getJobReports as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetJobReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleUpdateJobReport", () => {
    it("should update job report status successfully", async () => {
      // Arrange
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      (adminService.isThereJobReportWithId as jest.Mock).mockResolvedValue(
        true
      );
      (adminService.updateJobReportStatus as jest.Mock).mockResolvedValue(true);

      // Act
      await handleUpdateJobReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.isThereJobReportWithId).toHaveBeenCalledWith(1);
      expect(adminService.updateJobReportStatus).toHaveBeenCalledWith(
        1,
        "resolved"
      );
      expect(responseSendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 404 when report not found", async () => {
      // Arrange
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      (adminService.isThereJobReportWithId as jest.Mock).mockResolvedValue(
        false
      );

      // Act
      await handleUpdateJobReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "Report not found" });
    });

    it("should return 400 when invalid status provided", async () => {
      // Arrange
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "invalid_status" };

      (adminService.isThereJobReportWithId as jest.Mock).mockResolvedValue(
        true
      );

      // Act
      await handleUpdateJobReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Invalid status value",
      });
    });

    it("should return 500 when update fails", async () => {
      // Arrange
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      (adminService.isThereJobReportWithId as jest.Mock).mockResolvedValue(
        true
      );
      (adminService.updateJobReportStatus as jest.Mock).mockResolvedValue(
        false
      );

      // Act
      await handleUpdateJobReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Failed to update report",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      (adminService.isThereJobReportWithId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleUpdateJobReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleDeleteJob", () => {
    it("should delete job successfully", async () => {
      // Arrange
      mockRequest.params = { jobId: "1" };

      (adminService.isThereJobWithId as jest.Mock).mockResolvedValue(true);
      (adminService.deleteJob as jest.Mock).mockResolvedValue(true);

      // Act
      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.isThereJobWithId).toHaveBeenCalledWith(1);
      expect(adminService.deleteJob).toHaveBeenCalledWith(1);
      expect(responseSendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 400 when invalid job ID provided", async () => {
      // Arrange
      mockRequest.params = { jobId: "invalid" };

      // Act
      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: "Invalid job ID" });
    });

    it("should return 404 when job not found", async () => {
      // Arrange
      mockRequest.params = { jobId: "1" };

      (adminService.isThereJobWithId as jest.Mock).mockResolvedValue(false);

      // Act
      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "Job not found" });
    });

    it("should return 500 when deletion fails", async () => {
      // Arrange
      mockRequest.params = { jobId: "1" };

      (adminService.isThereJobWithId as jest.Mock).mockResolvedValue(true);
      (adminService.deleteJob as jest.Mock).mockResolvedValue(false);

      // Act
      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Failed to delete job",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      mockRequest.params = { jobId: "1" };

      (adminService.isThereJobWithId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleDeleteJob(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetJobReportsCount", () => {
    it("should return job reports count without duration filter", async () => {
      // Arrange
      (adminService.getJobReportsCount as jest.Mock).mockResolvedValue(10);

      // Act
      await handleGetJobReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getJobReportsCount).toHaveBeenCalledWith(undefined);
      expect(responseJson).toHaveBeenCalledWith({ count: 10 });
    });

    it("should return job reports count with valid duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "day" };
      (adminService.getJobReportsCount as jest.Mock).mockResolvedValue(5);

      // Act
      await handleGetJobReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getJobReportsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 5 });
    });

    it("should return 400 when invalid duration provided", async () => {
      // Arrange
      mockRequest.query = { duration: "invalid" };

      // Act
      await handleGetJobReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      (adminService.getJobReportsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetJobReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetJobsCount", () => {
    it("should return jobs count without duration filter", async () => {
      // Arrange
      (adminService.getJobsCount as jest.Mock).mockResolvedValue(100);

      // Act
      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getJobsCount).toHaveBeenCalledWith(undefined);
      expect(responseJson).toHaveBeenCalledWith({ count: 100 });
    });

    it("should return jobs count with valid day duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "day" };
      (adminService.getJobsCount as jest.Mock).mockResolvedValue(5);

      // Act
      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getJobsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 5 });
    });

    it("should return jobs count with valid week duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "week" };
      (adminService.getJobsCount as jest.Mock).mockResolvedValue(35);

      // Act
      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getJobsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 35 });
    });

    it("should return jobs count with valid month duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "month" };
      (adminService.getJobsCount as jest.Mock).mockResolvedValue(150);

      // Act
      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getJobsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 150 });
    });

    it("should return jobs count with valid year duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "year" };
      (adminService.getJobsCount as jest.Mock).mockResolvedValue(1200);

      // Act
      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getJobsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 1200 });
    });

    it("should return 400 when invalid duration provided", async () => {
      // Arrange
      mockRequest.query = { duration: "invalid" };

      // Act
      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      (adminService.getJobsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetJobsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetUsersCount", () => {
    it("should return users count without duration filter", async () => {
      // Arrange
      (adminService.getUsersCount as jest.Mock).mockResolvedValue(500);

      // Act
      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getUsersCount).toHaveBeenCalledWith(undefined);
      expect(responseJson).toHaveBeenCalledWith({ count: 500 });
    });

    it("should return users count with valid day duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "day" };
      (adminService.getUsersCount as jest.Mock).mockResolvedValue(10);

      // Act
      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getUsersCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 10 });
    });

    it("should return users count with valid week duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "week" };
      (adminService.getUsersCount as jest.Mock).mockResolvedValue(70);

      // Act
      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getUsersCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 70 });
    });

    it("should return users count with valid month duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "month" };
      (adminService.getUsersCount as jest.Mock).mockResolvedValue(300);

      // Act
      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getUsersCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 300 });
    });

    it("should return users count with valid year duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "year" };
      (adminService.getUsersCount as jest.Mock).mockResolvedValue(3600);

      // Act
      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getUsersCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 3600 });
    });

    it("should return 400 when invalid duration provided", async () => {
      // Arrange
      mockRequest.query = { duration: "invalid" };

      // Act
      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      (adminService.getUsersCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetUsersCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetPostsCount", () => {
    it("should return posts count without duration filter", async () => {
      // Arrange
      (adminService.getPostsCount as jest.Mock).mockResolvedValue(1000);

      // Act
      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getPostsCount).toHaveBeenCalledWith(undefined);
      expect(responseJson).toHaveBeenCalledWith({ count: 1000 });
    });

    it("should return posts count with valid day duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "day" };
      (adminService.getPostsCount as jest.Mock).mockResolvedValue(25);

      // Act
      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getPostsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 25 });
    });

    it("should return posts count with valid week duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "week" };
      (adminService.getPostsCount as jest.Mock).mockResolvedValue(175);

      // Act
      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getPostsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 175 });
    });

    it("should return posts count with valid month duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "month" };
      (adminService.getPostsCount as jest.Mock).mockResolvedValue(750);

      // Act
      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getPostsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 750 });
    });

    it("should return posts count with valid year duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "year" };
      (adminService.getPostsCount as jest.Mock).mockResolvedValue(9000);

      // Act
      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getPostsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 9000 });
    });

    it("should return 400 when invalid duration provided", async () => {
      // Arrange
      mockRequest.query = { duration: "invalid" };

      // Act
      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      (adminService.getPostsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetPostsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetConnectionsCount", () => {
    it("should return connections count without duration filter", async () => {
      // Arrange
      (adminService.getConnectionsCount as jest.Mock).mockResolvedValue(800);

      // Act
      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getConnectionsCount).toHaveBeenCalledWith(undefined);
      expect(responseJson).toHaveBeenCalledWith({ count: 800 });
    });

    it("should return connections count with valid day duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "day" };
      (adminService.getConnectionsCount as jest.Mock).mockResolvedValue(15);

      // Act
      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getConnectionsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 15 });
    });

    it("should return connections count with valid week duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "week" };
      (adminService.getConnectionsCount as jest.Mock).mockResolvedValue(105);

      // Act
      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getConnectionsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 105 });
    });

    it("should return connections count with valid month duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "month" };
      (adminService.getConnectionsCount as jest.Mock).mockResolvedValue(450);

      // Act
      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getConnectionsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 450 });
    });

    it("should return connections count with valid year duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "year" };
      (adminService.getConnectionsCount as jest.Mock).mockResolvedValue(5400);

      // Act
      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getConnectionsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 5400 });
    });

    it("should return 400 when invalid duration provided", async () => {
      // Arrange
      mockRequest.query = { duration: "invalid" };

      // Act
      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      (adminService.getConnectionsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetConnectionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetFollowsCount", () => {
    it("should return follows count without duration filter", async () => {
      // Arrange
      (adminService.getFollowsCount as jest.Mock).mockResolvedValue(1200);

      // Act
      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getFollowsCount).toHaveBeenCalledWith(undefined);
      expect(responseJson).toHaveBeenCalledWith({ count: 1200 });
    });

    it("should return follows count with valid day duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "day" };
      (adminService.getFollowsCount as jest.Mock).mockResolvedValue(20);

      // Act
      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getFollowsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 20 });
    });

    it("should return follows count with valid week duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "week" };
      (adminService.getFollowsCount as jest.Mock).mockResolvedValue(140);

      // Act
      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getFollowsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 140 });
    });

    it("should return follows count with valid month duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "month" };
      (adminService.getFollowsCount as jest.Mock).mockResolvedValue(600);

      // Act
      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getFollowsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 600 });
    });

    it("should return follows count with valid year duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "year" };
      (adminService.getFollowsCount as jest.Mock).mockResolvedValue(7200);

      // Act
      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getFollowsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 7200 });
    });

    it("should return 400 when invalid duration provided", async () => {
      // Arrange
      mockRequest.query = { duration: "invalid" };

      // Act
      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      (adminService.getFollowsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetFollowsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetReportedPosts", () => {
    it("should return reported posts successfully", async () => {
      // Arrange
      const mockReportedPosts = {
        data: [{ id: 1, content: "Post 1" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };
      (adminService.getReportedPosts as jest.Mock).mockResolvedValue(
        mockReportedPosts
      );

      // Act
      await handleGetReportedPosts(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getReportedPosts).toHaveBeenCalledWith(1);
      expect(responseJson).toHaveBeenCalledWith(mockReportedPosts);
    });

    it("should return 404 when no reported posts found", async () => {
      // Arrange
      const mockReportedPosts = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };
      (adminService.getReportedPosts as jest.Mock).mockResolvedValue(
        mockReportedPosts
      );

      // Act
      await handleGetReportedPosts(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getReportedPosts).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "No reported posts found",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      (adminService.getReportedPosts as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetReportedPosts(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetPostReports", () => {
    it("should return post reports successfully", async () => {
      // Arrange
      mockRequest.params = { postId: "1" };
      const mockPostReports = {
        data: [{ id: 1, reason: "Inappropriate" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };
      (adminService.getPostReports as jest.Mock).mockResolvedValue(
        mockPostReports
      );

      // Act
      await handleGetPostReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getPostReports).toHaveBeenCalledWith(1, 1);
      expect(responseJson).toHaveBeenCalledWith(mockPostReports);
    });

    it("should return 404 when no post reports found", async () => {
      // Arrange
      mockRequest.params = { postId: "1" };
      const mockPostReports = {
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      };
      (adminService.getPostReports as jest.Mock).mockResolvedValue(
        mockPostReports
      );

      // Act
      await handleGetPostReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        error: "No reports found for this post",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      mockRequest.params = { postId: "1" };
      (adminService.getPostReports as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetPostReports(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleDeletePost", () => {
    it("should delete post successfully", async () => {
      // Arrange
      mockRequest.params = { postId: "1" };

      (adminService.isTherePostWithId as jest.Mock).mockResolvedValue(true);
      (adminService.deletePost as jest.Mock).mockResolvedValue(true);

      // Act
      await handleDeletePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.isTherePostWithId).toHaveBeenCalledWith(1);
      expect(adminService.deletePost).toHaveBeenCalledWith(1);
      expect(responseSendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 400 when invalid post ID provided", async () => {
      // Arrange
      mockRequest.params = { postId: "invalid" };

      // Act
      await handleDeletePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: "Invalid post ID" });
    });

    it("should return 404 when post not found", async () => {
      // Arrange
      mockRequest.params = { postId: "1" };

      (adminService.isTherePostWithId as jest.Mock).mockResolvedValue(false);

      // Act
      await handleDeletePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "Post not found" });
    });

    it("should return 500 when deletion fails", async () => {
      // Arrange
      mockRequest.params = { postId: "1" };

      (adminService.isTherePostWithId as jest.Mock).mockResolvedValue(true);
      (adminService.deletePost as jest.Mock).mockResolvedValue(false);

      // Act
      await handleDeletePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Failed to delete post",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      mockRequest.params = { postId: "1" };

      (adminService.isTherePostWithId as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleDeletePost(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetPostReportsCount", () => {
    it("should return post reports count without duration filter", async () => {
      // Arrange
      (adminService.getPostReportsCount as jest.Mock).mockResolvedValue(50);

      // Act
      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getPostReportsCount).toHaveBeenCalledWith(undefined);
      expect(responseJson).toHaveBeenCalledWith({ count: 50 });
    });

    it("should return post reports count with valid day duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "day" };
      (adminService.getPostReportsCount as jest.Mock).mockResolvedValue(3);

      // Act
      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getPostReportsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 3 });
    });

    it("should return post reports count with valid week duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "week" };
      (adminService.getPostReportsCount as jest.Mock).mockResolvedValue(21);

      // Act
      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getPostReportsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 21 });
    });

    it("should return post reports count with valid month duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "month" };
      (adminService.getPostReportsCount as jest.Mock).mockResolvedValue(90);

      // Act
      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getPostReportsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 90 });
    });

    it("should return post reports count with valid year duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "year" };
      (adminService.getPostReportsCount as jest.Mock).mockResolvedValue(1080);

      // Act
      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getPostReportsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 1080 });
    });

    it("should return 400 when invalid duration provided", async () => {
      // Arrange
      mockRequest.query = { duration: "invalid" };

      // Act
      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      (adminService.getPostReportsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetPostReportsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleUpdatePostReport", () => {
    it("should update post report status successfully", async () => {
      // Arrange
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved", comment: "This has been fixed" };

      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        true
      );
      (adminService.updatePostReportStatus as jest.Mock).mockResolvedValue(
        true
      );

      // Act
      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.isTherePostReportWithId).toHaveBeenCalledWith(1);
      expect(adminService.updatePostReportStatus).toHaveBeenCalledWith(
        1,
        "resolved",
        "This has been fixed"
      );
      expect(responseSendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 404 when report not found", async () => {
      // Arrange
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        false
      );

      // Act
      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: "Report not found" });
    });

    it("should return 400 when invalid status provided", async () => {
      // Arrange
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "invalid_status" };

      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        true
      );

      // Act
      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Invalid status value",
      });
    });

    it("should return 400 when admin comment is invalid", async () => {
      // Arrange
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved", comment: {} };

      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        true
      );

      // Act
      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Invalid admin comment",
      });
    });

    it("should return 400 when admin comment is empty", async () => {
      // Arrange
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved", comment: "   " };

      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        true
      );

      // Act
      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Admin comment cannot be empty",
      });
    });

    it("should return 500 when update fails", async () => {
      // Arrange
      mockRequest.params = { reportId: "1" };
      mockRequest.body = { status: "resolved" };

      (adminService.isTherePostReportWithId as jest.Mock).mockResolvedValue(
        true
      );
      (adminService.updatePostReportStatus as jest.Mock).mockResolvedValue(
        false
      );

      // Act
      await handleUpdatePostReport(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Failed to update report",
      });
    });
  });

  describe("handleGetSubscriptionsCount", () => {
    it("should return subscriptions count without duration filter", async () => {
      // Arrange
      (adminService.getSubscriptionsCount as jest.Mock).mockResolvedValue(15);

      // Act
      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getSubscriptionsCount).toHaveBeenCalledWith(
        undefined
      );
      expect(responseJson).toHaveBeenCalledWith({ count: 15 });
    });

    it("should return subscriptions count with valid day duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "day" };
      (adminService.getSubscriptionsCount as jest.Mock).mockResolvedValue(2);

      // Act
      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getSubscriptionsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 2 });
    });

    it("should return subscriptions count with valid week duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "week" };
      (adminService.getSubscriptionsCount as jest.Mock).mockResolvedValue(7);

      // Act
      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getSubscriptionsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 7 });
    });

    it("should return subscriptions count with valid month duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "month" };
      (adminService.getSubscriptionsCount as jest.Mock).mockResolvedValue(30);

      // Act
      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getSubscriptionsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 30 });
    });

    it("should return subscriptions count with valid year duration filter", async () => {
      // Arrange
      mockRequest.query = { duration: "year" };
      (adminService.getSubscriptionsCount as jest.Mock).mockResolvedValue(365);

      // Act
      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(adminService.getSubscriptionsCount).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({ count: 365 });
    });

    it("should return 400 when invalid duration provided", async () => {
      // Arrange
      mockRequest.query = { duration: "decade" };

      // Act
      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error:
          "Invalid duration parameter. Use 'day', 'week', 'month', or 'year'.",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      (adminService.getSubscriptionsCount as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await handleGetSubscriptionsCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });
});
