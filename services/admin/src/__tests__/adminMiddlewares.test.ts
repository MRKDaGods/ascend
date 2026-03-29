// Import necessary types from Express framework
import { Response, NextFunction } from "express";
// Import the authenticated request type from shared middleware
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
// Import the middleware function to be tested
import { isUserAdmin } from "../middlewares/adminMiddlewares";
// Import admin service functions that will be mocked
import * as adminService from "../services/adminService";

// Mock the adminService module to control its behavior during tests
jest.mock("../services/adminService", () => ({
  isAdmin: jest.fn(), // Create a mock implementation of the isAdmin function
}));

// Main test suite for admin middleware functions
describe("Admin Middlewares", () => {
  // Declare variables to hold mock objects and functions
  let mockRequest: Partial<AuthenticatedRequest>; // Partial request object
  let mockResponse: Partial<Response>; // Partial response object
  let nextFunction: NextFunction; // Express next function
  let responseJson: jest.Mock; // Mock for response.json method
  let responseStatus: jest.Mock; // Mock for response.status method

  // Setup before each test to ensure clean test environment
  beforeEach(() => {
    // Create mock implementations that allow method chaining
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnThis();

    // Initialize mock request with user ID
    mockRequest = {
      user: { id: 1 },
    };

    // Initialize mock response with json and status methods
    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };

    // Initialize mock for the next middleware function
    nextFunction = jest.fn();

    // Clear all previous mock calls to ensure test isolation
    jest.clearAllMocks();
  });

  // Test case: Verify that middleware allows access when user is an admin
  it("should call next() when user is admin", async () => {
    // Configure the mock to simulate an admin user
    (adminService.isAdmin as jest.Mock).mockResolvedValue(true);

    // Call the middleware function with our mock objects
    await isUserAdmin(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    // Assertions to verify correct behavior
    expect(adminService.isAdmin).toHaveBeenCalledWith(1); // Verify admin check with correct ID
    expect(nextFunction).toHaveBeenCalled(); // Verify next() was called to continue execution
    expect(responseStatus).not.toHaveBeenCalled(); // Verify no error status was set
    expect(responseJson).not.toHaveBeenCalled(); // Verify no error response was sent
  });

  // Test case: Verify that middleware blocks access when user is not an admin
  it("should return 403 when user is not admin", async () => {
    // Configure the mock to simulate a non-admin user
    (adminService.isAdmin as jest.Mock).mockResolvedValue(false);

    // Call the middleware function with our mock objects
    await isUserAdmin(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    // Assertions to verify correct behavior
    expect(adminService.isAdmin).toHaveBeenCalledWith(1); // Verify admin check with correct ID
    expect(nextFunction).not.toHaveBeenCalled(); // Verify next() was NOT called
    expect(responseStatus).toHaveBeenCalledWith(403); // Verify correct status code was set
    expect(responseJson).toHaveBeenCalledWith({
      error: "Unauthorized: Admin privileges required to access this resource",
    }); // Verify correct error message was sent
  });

  // Test case: Verify middleware handles service errors properly
  it("should return 500 when an error occurs", async () => {
    // Configure the mock to simulate a service error
    (adminService.isAdmin as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    // Call the middleware function with our mock objects
    await isUserAdmin(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    // Assertions to verify correct error handling
    expect(adminService.isAdmin).toHaveBeenCalledWith(1); // Verify admin check was attempted
    expect(nextFunction).not.toHaveBeenCalled(); // Verify next() was NOT called
    expect(responseStatus).toHaveBeenCalledWith(500); // Verify correct error status was set
    expect(responseJson).toHaveBeenCalledWith({
      message: "Internal Server Error",
    }); // Verify generic error message was sent
  });

  // Test case: Verify middleware handles missing user data properly
  it("should handle missing user in request", async () => {
    // Modify request to simulate missing user data
    mockRequest.user = undefined;

    // Call the middleware function with our mock objects
    await isUserAdmin(
      mockRequest as AuthenticatedRequest,
      mockResponse as Response,
      nextFunction
    );

    // Assertions to verify correct error handling for missing user
    expect(adminService.isAdmin).not.toHaveBeenCalled(); // Verify admin check was not attempted
    expect(nextFunction).not.toHaveBeenCalled(); // Verify next() was NOT called
    expect(responseStatus).toHaveBeenCalledWith(500); // Verify correct error status was set
    expect(responseJson).toHaveBeenCalledWith({
      message: "Internal Server Error",
    }); // Verify generic error message was sent
  });
});
