import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { isUserAdmin } from "../middlewares/adminMiddlewares";
import * as adminService from "../services/adminService";

// Mock the adminService
jest.mock("../services/adminService", () => ({
  isAdmin: jest.fn(),
}));

describe("Admin Middlewares", () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnThis();

    mockRequest = {
      user: { id: 1 },
    };

    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };

    nextFunction = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  it("should call next() when user is admin", async () => {
    // Arrange
    (adminService.isAdmin as jest.Mock).mockResolvedValue(true);

    // Act
    await isUserAdmin(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(adminService.isAdmin).toHaveBeenCalledWith(1);
    expect(nextFunction).toHaveBeenCalled();
    expect(responseStatus).not.toHaveBeenCalled();
    expect(responseJson).not.toHaveBeenCalled();
  });

  it("should return 403 when user is not admin", async () => {
    // Arrange
    (adminService.isAdmin as jest.Mock).mockResolvedValue(false);

    // Act
    await isUserAdmin(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(adminService.isAdmin).toHaveBeenCalledWith(1);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(responseStatus).toHaveBeenCalledWith(403);
    expect(responseJson).toHaveBeenCalledWith({
      error: "Unauthorized: Admin privileges required to access this resource",
    });
  });

  it("should return 500 when an error occurs", async () => {
    // Arrange
    (adminService.isAdmin as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    // Act
    await isUserAdmin(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(adminService.isAdmin).toHaveBeenCalledWith(1);
    expect(nextFunction).not.toHaveBeenCalled();
    expect(responseStatus).toHaveBeenCalledWith(500);
    expect(responseJson).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });

  it("should handle missing user in request", async () => {
    // Arrange
    mockRequest.user = undefined;

    // Act
    await isUserAdmin(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    // Assert
    expect(adminService.isAdmin).not.toHaveBeenCalled();
    expect(nextFunction).not.toHaveBeenCalled();
    expect(responseStatus).toHaveBeenCalledWith(500);
    expect(responseJson).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
