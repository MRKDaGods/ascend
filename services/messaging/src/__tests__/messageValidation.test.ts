import { messageValidationRules } from "../validations/messageValidation";

// Mock the express-validator module to isolate tests
// This creates a mock implementation that simulates the behavior of express-validator
jest.mock("express-validator", () => {
  const bodyMock = jest.fn().mockReturnValue({
    optional: jest.fn().mockReturnThis(),
    isString: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    // Custom validator implementation to capture the validation function
    custom: jest.fn().mockImplementation((fn) => {
      return { __validator: fn };
    }),
  });

  return {
    body: bodyMock,
  };
});

describe("Message Validation Rules", () => {
  // Reset mocks before each test to ensure clean state
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test that validation rules are defined and properly structured
  it("should define validation rules", () => {
    expect(messageValidationRules).toBeDefined();
    expect(messageValidationRules.length).toBeGreaterThan(0);

    // Find the file validator by looking for the custom validator function
    const fileValidator = messageValidationRules.find(
      (rule) => (rule as any).__validator
    );
    expect(fileValidator).toBeDefined();
  });

  describe("File Validation", () => {
    // Test file validation logic for various scenarios
    it("should validate file size", () => {
      // Retrieve the custom validator function for file validation
      const fileValidator = messageValidationRules.find(
        (rule) => (rule as any).__validator
      );
      expect(fileValidator).toBeDefined();

      const validator = (fileValidator as any).__validator;

      // Scenario 1: No file attached - should pass validation
      const reqWithoutFile = { file: undefined };
      expect(validator(null, { req: reqWithoutFile })).toBe(true);

      // Scenario 2: File too large (> 5MB) - should throw size error
      const reqWithLargeFile = {
        file: {
          size: 6 * 1024 * 1024, // 6MB exceeds the 5MB limit
          mimetype: "image/jpeg",
        },
      };
      expect(() => validator(null, { req: reqWithLargeFile })).toThrow(
        "File size exceeds 5MB limit"
      );

      // Scenario 3: Invalid file type - should throw type error
      const reqWithInvalidType = {
        file: {
          size: 1024,
          mimetype: "application/x-invalid", // Unsupported file type
        },
      };
      expect(() => validator(null, { req: reqWithInvalidType })).toThrow(
        "Invalid file type"
      );

      // Scenario 4: Valid file (correct size and type) - should pass validation
      const reqWithValidFile = {
        file: {
          size: 1024, // Small file size
          mimetype: "image/jpeg", // Supported image type
        },
      };
      expect(validator(null, { req: reqWithValidFile })).toBe(true);
    });
  });
});
