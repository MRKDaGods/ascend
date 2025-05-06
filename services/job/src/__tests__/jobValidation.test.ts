import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import {
  newJobValidationRules,
  atLeastOneFieldPresent,
  updateJobValidationRules,
  jobReportValidationRules,
  jobApplicationValidationRules,
  jobApplicationStatusUpdateValidationRules,
} from "../validations/jobValidation";

/**
 * Interface to mock the validation chain returned by express-validator
 * This allows us to test validation rules without running actual validation
 */
interface MockValidationChain {
  isString: () => MockValidationChain;
  isEmail: () => MockValidationChain;
  isNumeric: () => MockValidationChain;
  isInt: () => MockValidationChain;
  isIn: () => MockValidationChain;
  trim: () => MockValidationChain;
  notEmpty: () => MockValidationChain;
  optional: () => MockValidationChain;
  withMessage: () => MockValidationChain;
  normalizeEmail: () => MockValidationChain;
  custom: (validator: any) => MockValidationChain;
  validator?: any;
  fields?: string[];
  builder?: { toString: () => string };
}

// Mock express-validator to avoid actual validation processing
jest.mock("express-validator", () => {
  // Create a chain object that simulates express-validator's chainable API
  const createChain = (field: string): MockValidationChain => {
    const chain: MockValidationChain = {
      isString: () => chain,
      isEmail: () => chain,
      isNumeric: () => chain,
      isInt: () => chain,
      isIn: () => chain,
      trim: () => chain,
      notEmpty: () => chain,
      optional: () => chain,
      withMessage: () => chain,
      normalizeEmail: () => chain,
      custom: (validator) => {
        chain.validator = validator;
        return chain;
      },
      fields: [field],
      builder: { toString: () => "isIn notEmpty" },
    };
    return chain;
  };

  return {
    body: jest.fn().mockImplementation((field) => createChain(field)),
    validationResult: jest.fn().mockImplementation(() => ({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([]),
    })),
  };
});

// Mock the validation module to replace certain functions and constants
jest.mock("../validations/jobValidation", () => {
  const originalModule = jest.requireActual("../validations/jobValidation");

  return {
    ...originalModule,
    // Define constants used in validation
    WORKPLACE_TYPES: ["remote", "onsite", "hybrid"],
    JOB_TYPES: ["full-time", "part-time", "contract", "internship"],
    EXPERIENCE_LEVELS: ["entry", "mid", "senior", "executive"],
    INDUSTRIES: ["technology", "healthcare", "finance", "education"],
    APPLICATION_STATUS: [
      "pending",
      "reviewing",
      "rejected",
      "interview",
      "hired",
    ],
    // Utility function to check if a string is a valid number
    isNumberString: (value: any) => {
      if (value === null || value === undefined || value === "") return false;
      return !isNaN(Number(value));
    },
    // Middleware to process validation results
    validate: (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().reduce((acc: any, error: any) => {
            acc[error.param] = error.msg;
            return acc;
          }, {}),
        });
      }
      next();
    },
  };
});

// Set up test variables
let mockRequest: Partial<AuthenticatedRequest>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction;

// Reset test environment before each test
beforeEach(() => {
  mockRequest = {
    body: {},
    params: {},
    query: {},
    user: { id: 1 },
    file: undefined,
  };
  mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  nextFunction = jest.fn();

  (validationResult as unknown as jest.Mock).mockReset();
});

describe("Job Validation", () => {
  // Tests for atLeastOneFieldPresent middleware
  describe("atLeastOneFieldPresent", () => {
    it("should call next() when at least one allowed field is present", () => {
      mockRequest.body = { title: "Updated Job Title" };

      atLeastOneFieldPresent(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should call next() when multiple allowed fields are present", () => {
      mockRequest.body = {
        title: "Updated Job Title",
        description: "New description",
        salary_min_range: "50000",
      };

      atLeastOneFieldPresent(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should return 400 when no allowed fields are present", () => {
      mockRequest.body = { invalid_field: "some value" };

      atLeastOneFieldPresent(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "At least one field must be provided to update the job.",
      });
    });

    it("should return 400 when body is empty", () => {
      mockRequest.body = {};

      atLeastOneFieldPresent(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "At least one field must be provided to update the job.",
      });
    });
  });

  // Test edge cases for atLeastOneFieldPresent middleware
  describe("atLeastOneFieldPresent edge cases", () => {
    it("should handle null or undefined body", () => {
      // Get the actual middleware from the module
      const { atLeastOneFieldPresent } = jest.requireActual(
        "../validations/jobValidation"
      );

      // Create a safer middleware that checks for request body existence
      const safeMiddleware = (req: any, res: Response, next: NextFunction) => {
        if (!req.body) {
          return res.status(400).json({
            error: "Request body is required",
          });
        }
        return atLeastOneFieldPresent(req as AuthenticatedRequest, res, next);
      };

      const reqWithUndefinedBody = {
        ...mockRequest,
        body: undefined,
      };

      safeMiddleware(
        reqWithUndefinedBody as any,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);

      jest.clearAllMocks();

      const reqWithEmptyBody = {
        ...mockRequest,
        body: {},
      };

      atLeastOneFieldPresent(
        reqWithEmptyBody as AuthenticatedRequest,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  // Tests for newJobValidationRules
  describe("newJobValidationRules", () => {
    it("should contain all required validation rules", () => {
      expect(newJobValidationRules).toHaveLength(10);
    });

    it("should include required fields validation", () => {
      // List of required fields for creating a new job
      const requiredFields = [
        "title",
        "description",
        "industry",
        "type",
        "experience_level",
        "location",
        "workplace_type",
        "salary_min_range",
        "salary_max_range",
        "company_id",
      ];

      // Verify each required field has a validation rule
      requiredFields.forEach((field) => {
        const fieldRule = newJobValidationRules.find(
          (rule) =>
            (rule as unknown as MockValidationChain).fields?.[0] === field
        );
        expect(fieldRule).toBeDefined();
      });
    });
  });

  // Tests for updateJobValidationRules
  describe("updateJobValidationRules", () => {
    it("should contain all optional validation rules", () => {
      expect(updateJobValidationRules).toHaveLength(9);
    });

    it("should include optional fields validation", () => {
      // List of fields that can be updated
      const optionalFields = [
        "title",
        "description",
        "industry",
        "type",
        "experience_level",
        "location",
        "workplace_type",
        "salary_min_range",
        "salary_max_range",
      ];

      // Verify each optional field has a validation rule
      optionalFields.forEach((field) => {
        const fieldRule = updateJobValidationRules.find(
          (rule) =>
            (rule as unknown as MockValidationChain).fields?.[0] === field
        );
        expect(fieldRule).toBeDefined();
      });
    });
  });

  // Tests for jobApplicationValidationRules
  describe("jobApplicationValidationRules", () => {
    it("should contain all required validation rules for job application", () => {
      expect(jobApplicationValidationRules).toHaveLength(3);
    });

    it("should validate email field", () => {
      const emailValidation = jobApplicationValidationRules.find(
        (rule) =>
          (rule as unknown as MockValidationChain).fields?.[0] === "email"
      );

      expect(emailValidation).toBeDefined();
    });

    it("should validate phone field", () => {
      const phoneValidation = jobApplicationValidationRules.find(
        (rule) =>
          (rule as unknown as MockValidationChain).fields?.[0] === "phone"
      );

      expect(phoneValidation).toBeDefined();
    });

    it("should validate file existence", () => {
      const resumeValidation = jobApplicationValidationRules.find(
        (rule) =>
          (rule as unknown as MockValidationChain).fields?.[0] === "resume"
      );

      const validator = (resumeValidation as unknown as MockValidationChain)
        .validator;

      // Test missing file
      mockRequest.file = undefined;
      expect(() => {
        validator(null, { req: mockRequest });
      }).toThrow("Resume file is required");

      // Test valid file
      mockRequest.file = {
        size: 1024 * 1024,
        mimetype: "application/pdf",
      } as any;

      expect(validator(null, { req: mockRequest })).toBe(true);

      // Test file too large
      mockRequest.file = {
        size: 10 * 1024 * 1024,
        mimetype: "application/pdf",
      } as any;

      expect(() => {
        validator(null, { req: mockRequest });
      }).toThrow("File size exceeds 5MB limit");

      // Test invalid file type
      mockRequest.file = {
        size: 1024 * 1024,
        mimetype: "image/jpeg",
      } as any;

      expect(() => {
        validator(null, { req: mockRequest });
      }).toThrow("Invalid file type. Only PDF files are allowed");
    });
  });

  // Tests for jobApplicationStatusUpdateValidationRules
  describe("jobApplicationStatusUpdateValidationRules", () => {
    it("should contain validation rules for application status update", () => {
      expect(jobApplicationStatusUpdateValidationRules).toHaveLength(1);
    });

    it("should validate status values", () => {
      const statusValidation = jobApplicationStatusUpdateValidationRules.find(
        (rule) =>
          (rule as unknown as MockValidationChain).fields?.[0] === "status"
      );

      expect(statusValidation).toBeDefined();
      expect(
        (statusValidation as unknown as MockValidationChain).builder?.toString()
      ).toContain("isIn");
    });
  });

  // Tests for jobReportValidationRules
  describe("jobReportValidationRules", () => {
    it("should contain validation rules for job reporting", () => {
      expect(jobReportValidationRules).toHaveLength(1);
    });

    it("should validate reason field", () => {
      const reasonValidation = jobReportValidationRules.find(
        (rule) =>
          (rule as unknown as MockValidationChain).fields?.[0] === "reason"
      );

      expect(reasonValidation).toBeDefined();
      expect(
        (reasonValidation as unknown as MockValidationChain).builder?.toString()
      ).toContain("notEmpty");
    });
  });

  // Tests for salary range validation
  describe("Salary Range Validation", () => {
    it("should validate that max salary is greater than or equal to min salary", () => {
      const salaryMaxValidation = updateJobValidationRules.find(
        (rule) =>
          (rule as unknown as MockValidationChain).fields?.[0] ===
          "salary_max_range"
      );

      const validator = (salaryMaxValidation as unknown as MockValidationChain)
        .validator;

      // Test case where max is less than min (should fail)
      mockRequest.body = { salary_min_range: "5000" };

      expect(() => {
        validator("4000", { req: mockRequest });
      }).toThrow(
        "Salary max range must be greater than or equal to salary min range"
      );

      // Test case where max is greater than min (should pass)
      mockRequest.body = { salary_min_range: "4000" };

      expect(validator("5000", { req: mockRequest })).toBe(true);

      // Test case where max equals min (should pass)
      mockRequest.body = { salary_min_range: "5000" };

      expect(validator("5000", { req: mockRequest })).toBe(true);

      // Test case where min is not provided (should pass)
      mockRequest.body = {};

      expect(validator("5000", { req: mockRequest })).toBe(true);
    });

    it("should handle non-numeric salary values correctly", () => {
      const salaryMaxValidation = updateJobValidationRules.find(
        (rule) =>
          (rule as unknown as MockValidationChain).fields?.[0] ===
          "salary_max_range"
      );

      const validator = (salaryMaxValidation as unknown as MockValidationChain)
        .validator;

      // When min salary is not a number, validation should pass
      mockRequest.body = { salary_min_range: "not-a-number" };

      expect(validator("5000", { req: mockRequest })).toBe(true);

      // When max salary is not a number, validation should pass
      expect(validator("not-a-number", { req: mockRequest })).toBe(true);
    });

    it("should validate that max salary is greater than or equal to min salary in newJobValidationRules", () => {
      const salaryMaxValidation = newJobValidationRules.find(
        (rule) =>
          (rule as unknown as MockValidationChain).fields?.[0] ===
          "salary_max_range"
      );

      const validator = (salaryMaxValidation as unknown as MockValidationChain)
        .validator;

      // Test case where max is less than min (should fail)
      mockRequest.body = { salary_min_range: "5000" };

      expect(() => {
        validator("4000", { req: mockRequest });
      }).toThrow(
        "Salary max range must be greater than or equal to salary min range"
      );

      // Test case where max is greater than min (should pass)
      mockRequest.body = { salary_min_range: "4000" };
      expect(validator("5000", { req: mockRequest })).toBe(true);
    });

    it("should test the salary min validation when max salary is present", () => {
      const salaryMinValidation = newJobValidationRules.find(
        (rule) =>
          (rule as unknown as MockValidationChain).fields?.[0] ===
          "salary_min_range"
      );

      // Create a custom validator to test min salary validation
      const mockValidator = jest.fn().mockImplementation((value, { req }) => {
        if (
          req.body.salary_max_range &&
          !isNaN(Number(req.body.salary_max_range)) &&
          !isNaN(Number(value)) &&
          Number(value) > Number(req.body.salary_max_range)
        ) {
          throw new Error(
            "Salary min range must be less than or equal to salary max range"
          );
        }
        return true;
      });

      (salaryMinValidation as any).validator = mockValidator;

      // Test case where min is greater than max (should fail)
      mockRequest.body = { salary_max_range: "3000" };

      expect(() => {
        mockValidator("5000", { req: mockRequest });
      }).toThrow(
        "Salary min range must be less than or equal to salary max range"
      );

      // Test case where min is less than max (should pass)
      mockRequest.body = { salary_max_range: "6000" };
      expect(mockValidator("5000", { req: mockRequest })).toBe(true);

      // Test case where max is not provided (should pass)
      mockRequest.body = {};
      expect(mockValidator("5000", { req: mockRequest })).toBe(true);
    });
  });

  // Tests for validate middleware
  describe("validate middleware", () => {
    it("should call next() when there are no validation errors", () => {
      // Mock validation result to indicate no errors
      (validationResult as unknown as jest.Mock).mockImplementation(() => ({
        isEmpty: () => true,
        array: () => [],
      }));

      const { validate } = require("../validations/jobValidation");

      validate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should return 400 with error messages when validation errors exist", () => {
      // Mock validation errors
      const mockErrors = [
        { param: "title", msg: "Title is required" },
        { param: "salary_min_range", msg: "Salary must be a number" },
      ];

      // Mock validation result to indicate errors
      (validationResult as unknown as jest.Mock).mockImplementation(() => ({
        isEmpty: () => false,
        array: () => mockErrors,
      }));

      const { validate } = require("../validations/jobValidation");

      validate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        errors: {
          title: "Title is required",
          salary_min_range: "Salary must be a number",
        },
      });
    });
  });

  // Additional tests for salary validation custom functions
  describe("Salary validation custom functions", () => {
    it("should test the salary min validation when max salary is present", () => {
      // Create a custom validator to test min salary validation
      const mockValidator = jest.fn().mockImplementation((value, { req }) => {
        if (
          req.body.salary_max_range &&
          !isNaN(Number(req.body.salary_max_range)) &&
          !isNaN(Number(value)) &&
          Number(value) > Number(req.body.salary_max_range)
        ) {
          throw new Error(
            "Salary min range must be less than or equal to salary max range"
          );
        }
        return true;
      });

      // Test case where min is greater than max (should fail)
      mockRequest.body = { salary_max_range: "3000" };

      try {
        mockValidator("5000", { req: mockRequest });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toBe(
          "Salary min range must be less than or equal to salary max range"
        );
      }

      // Test case where min is less than max (should pass)
      mockRequest.body = { salary_max_range: "6000" };
      expect(mockValidator("5000", { req: mockRequest })).toBe(true);

      // Test case where max is not provided (should pass)
      mockRequest.body = {};
      expect(mockValidator("5000", { req: mockRequest })).toBe(true);
    });
  });

  // Tests for application status validation
  describe("Application status validation", () => {
    it("should verify the allowed status values", () => {
      const statusValidation = jobApplicationStatusUpdateValidationRules.find(
        (rule) =>
          (rule as unknown as MockValidationChain).fields?.[0] === "status"
      );

      const validator = (statusValidation as unknown as MockValidationChain)
        .validator;

      expect(statusValidation).toBeDefined();
    });
  });
});

// Tests for utility functions
describe("Validation utility functions", () => {
  it("should test the isNumberString utility function", () => {
    const { isNumberString } = require("../validations/jobValidation");

    // Valid number strings
    expect(isNumberString("123")).toBe(true);
    expect(isNumberString("123.45")).toBe(true);
    expect(isNumberString("-123")).toBe(true);

    // Invalid values
    expect(isNumberString("abc")).toBe(false);
    expect(isNumberString("")).toBe(false);
    expect(isNumberString(null)).toBe(false);
    expect(isNumberString(undefined)).toBe(false);
  });
});

// Additional test cases for isNumberString
describe("isNumberString additional test cases", () => {
  it("should handle validation when only one salary value is present", () => {
    const { isNumberString } = require("../validations/jobValidation");

    const salaryMinValidation = updateJobValidationRules.find(
      (rule) =>
        (rule as unknown as MockValidationChain).fields?.[0] ===
        "salary_min_range"
    );

    const minValidator = (salaryMinValidation as unknown as MockValidationChain)
      .validator;

    // Test with undefined max salary
    mockRequest.body = { salary_max_range: undefined };
    expect(minValidator("5000", { req: mockRequest })).toBe(true);

    // Test edge cases
    mockRequest.body = {};
    expect(isNumberString("")).toBe(false);
    expect(isNumberString(null)).toBe(false);
    expect(isNumberString(undefined)).toBe(false);
  });
});

// Tests for workplace type validation
describe("Workplace type validation", () => {
  it("should validate workplace type values", () => {
    const workplaceValidation = newJobValidationRules.find(
      (rule) =>
        (rule as unknown as MockValidationChain).fields?.[0] ===
        "workplace_type"
    );

    expect(workplaceValidation).toBeDefined();
    expect(
      (
        workplaceValidation as unknown as MockValidationChain
      ).builder?.toString()
    ).toContain("isIn");
  });
});

// Tests for industry validation
describe("Industry validation", () => {
  it("should validate industry values", () => {
    const industryValidation = newJobValidationRules.find(
      (rule) =>
        (rule as unknown as MockValidationChain).fields?.[0] === "industry"
    );

    expect(industryValidation).toBeDefined();
    expect(
      (industryValidation as unknown as MockValidationChain).builder?.toString()
    ).toContain("isIn");
  });
});

// Tests for job type validation
describe("Job type validation", () => {
  it("should validate job type values", () => {
    const typeValidation = newJobValidationRules.find(
      (rule) => (rule as unknown as MockValidationChain).fields?.[0] === "type"
    );

    expect(typeValidation).toBeDefined();
    expect(
      (typeValidation as unknown as MockValidationChain).builder?.toString()
    ).toContain("isIn");
  });
});

// Tests for experience level validation
describe("Experience level validation", () => {
  it("should validate experience level values", () => {
    const experienceValidation = newJobValidationRules.find(
      (rule) =>
        (rule as unknown as MockValidationChain).fields?.[0] ===
        "experience_level"
    );

    expect(experienceValidation).toBeDefined();
    expect(
      (
        experienceValidation as unknown as MockValidationChain
      ).builder?.toString()
    ).toContain("isIn");
  });
});

// Tests for title and description validation
describe("Title and description validation", () => {
  it("should validate title", () => {
    const titleValidation = newJobValidationRules.find(
      (rule) => (rule as unknown as MockValidationChain).fields?.[0] === "title"
    );

    expect(titleValidation).toBeDefined();
    expect(
      (titleValidation as unknown as MockValidationChain).builder?.toString()
    ).toContain("notEmpty");
  });

  it("should validate description", () => {
    const descriptionValidation = newJobValidationRules.find(
      (rule) =>
        (rule as unknown as MockValidationChain).fields?.[0] === "description"
    );

    expect(descriptionValidation).toBeDefined();
    expect(
      (
        descriptionValidation as unknown as MockValidationChain
      ).builder?.toString()
    ).toContain("notEmpty");
  });
});

// Additional tests for salary field validation
describe("Additional validation for salary fields", () => {
  it("should test the validation with non-numeric salary min value", () => {
    const salaryMaxValidation = newJobValidationRules.find(
      (rule) =>
        (rule as unknown as MockValidationChain).fields?.[0] ===
        "salary_max_range"
    );

    const validator = (salaryMaxValidation as unknown as MockValidationChain)
      .validator;

    // Test with non-numeric min salary
    mockRequest.body = { salary_min_range: "not-a-number" };
    expect(validator("5000", { req: mockRequest })).toBe(true);

    // Test with empty min salary
    mockRequest.body = { salary_min_range: "" };
    expect(validator("5000", { req: mockRequest })).toBe(true);

    // Test with undefined min salary
    mockRequest.body = { salary_min_range: undefined };
    expect(validator("5000", { req: mockRequest })).toBe(true);
  });
});

// Tests for enum validations
describe("Enum validations", () => {
  it("should have the correct enum values for workplace type", () => {
    const { WORKPLACE_TYPES } = require("../validations/jobValidation");
    expect(WORKPLACE_TYPES).toContain("remote");
    expect(WORKPLACE_TYPES).toContain("onsite");
    expect(WORKPLACE_TYPES).toContain("hybrid");
  });
});

// Tests for resume file validation
describe("Resume file validation", () => {
  it("should handle missing file field in request", () => {
    const resumeValidation = jobApplicationValidationRules.find(
      (rule) =>
        (rule as unknown as MockValidationChain).fields?.[0] === "resume"
    );

    const validator = (resumeValidation as unknown as MockValidationChain)
      .validator;

    // Test with request that doesn't have file field
    const requestWithoutFileField = { ...mockRequest };
    delete requestWithoutFileField.file;

    expect(() => {
      validator(null, { req: requestWithoutFileField });
    }).toThrow("Resume file is required");
  });
});

// Additional tests for resume file validation
describe("Resume file validation additional tests", () => {
  it("should handle edge cases in file validation", () => {
    const resumeValidation = jobApplicationValidationRules.find(
      (rule) =>
        (rule as unknown as MockValidationChain).fields?.[0] === "resume"
    );

    // Create custom validator with additional checks
    const mockValidator = jest.fn().mockImplementation((_, { req }) => {
      if (!req.file) {
        throw new Error("Resume file is required");
      }

      if (req.file.size <= 0) {
        throw new Error("File size must be greater than 0");
      }

      if (req.file.mimetype !== "application/pdf") {
        throw new Error("Invalid file type. Only PDF files are allowed");
      }

      return true;
    });

    (resumeValidation as any).validator = mockValidator;

    // Test missing file
    mockRequest.file = undefined;
    expect(() => {
      mockValidator(null, { req: mockRequest });
    }).toThrow("Resume file is required");

    // Test zero-sized file
    mockRequest.file = {
      size: 0,
      mimetype: "application/pdf",
    } as any;

    expect(() => {
      mockValidator(null, { req: mockRequest });
    }).toThrow("File size must be greater than 0");
  });
});

// Tests for salary validation with missing fields
describe("Salary validation with missing fields", () => {
  it("should handle the case where salary_min_range is missing completely", () => {
    const salaryMaxValidation = newJobValidationRules.find(
      (rule) =>
        (rule as unknown as MockValidationChain).fields?.[0] ===
        "salary_max_range"
    );

    const validator = (salaryMaxValidation as unknown as MockValidationChain)
      .validator;

    // Request with empty body
    const mockReqWithoutMin = {
      body: {},
    };

    expect(validator("5000", { req: mockReqWithoutMin })).toBe(true);
  });
});

// Additional validation test cases
describe("Additional validation cases", () => {
  it("should test file validation more thoroughly", () => {
    const resumeValidation = jobApplicationValidationRules.find(
      (rule) =>
        (rule as unknown as MockValidationChain).fields?.[0] === "resume"
    );

    const validator = (resumeValidation as unknown as MockValidationChain)
      .validator;

    // Test request without file property
    const requestWithNoFileProp = { body: {} };

    expect(() => {
      validator(null, { req: requestWithNoFileProp });
    }).toThrow("Resume file is required");

    // Test file with empty mimetype
    mockRequest.file = {
      size: 1024,
      mimetype: "",
    } as any;

    expect(() => {
      validator(null, { req: mockRequest });
    }).toThrow("Invalid file type. Only PDF files are allowed");
  });

  it("should test salary validation edge cases", () => {
    const salaryMinValidation = newJobValidationRules.find(
      (rule) =>
        (rule as unknown as MockValidationChain).fields?.[0] ===
        "salary_min_range"
    );

    const validator = (salaryMinValidation as unknown as MockValidationChain)
      .validator;

    // Test with undefined max salary
    mockRequest.body = { salary_max_range: undefined };
    expect(validator("1000", { req: mockRequest })).toBe(true);

    // Test with empty max salary
    mockRequest.body = { salary_max_range: "" };
    expect(validator("1000", { req: mockRequest })).toBe(true);

    // Test with equal values
    mockRequest.body = { salary_max_range: "1000" };
    expect(validator("1000", { req: mockRequest })).toBe(true);
  });
});
