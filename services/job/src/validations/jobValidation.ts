import { Response, NextFunction } from "express";
import { body, ValidationChain } from "express-validator";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";

/**
 * Validation rules for creating a new job
 */
export const newJobValidationRules: ValidationChain[] = [
  // Title
  body("title").isString().trim().notEmpty().withMessage("Title is required"),

  // Description
  body("description")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  // Industry
  body("industry")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Industry is required"),

  // Type
  body("type")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .isIn([
      "Full-time",
      "Part-time",
      "Contract",
      "Temporary",
      "Volunteer",
      "Internship",
      "Other",
    ])
    .withMessage(
      "Invalid type. Allowed values: Full-time, Part-time, Contract, Temporary, Volunteer, Internship, Other"
    ),

  // Experience Level
  body("experience_level")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Experience level is required")
    .isIn(["Internship", "Entry", "Associate", "Mid", "Director"])
    .withMessage(
      "Invalid experience level. Allowed values: Internship, Entry, Associate, Mid, Director"
    ),

  // Location
  body("location")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  // Workplace Type
  body("workplace_type")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Workplace type is required")
    .isIn(["On-site", "Hybrid", "Remote"])
    .withMessage(
      "Invalid workplace type. Allowed values: On-site, Hybrid, Remote"
    ),

  // Salary min range
  body("salary_min_range")
    .optional()
    .isNumeric()
    .withMessage("Salary min range must be a valid number")
    .custom((value) => value >= 0)
    .withMessage("Salary min range must be at least 0"),

  // Salary max range
  body("salary_max_range")
    .optional()
    .isNumeric()
    .withMessage("Salary max range must be a valid number")
    .custom((salary_max_range, { req }) => {
      if (
        req.body.salary_min_range &&
        Number(salary_max_range) < Number(req.body.salary_min_range)
      ) {
        throw new Error(
          "Salary max range must be greater than or equal to salary min range"
        );
      }
      return true;
    }),

  // Company ID (Required Foreign Key)
  body("company_id")
    .isInt({ gt: 0 })
    .withMessage("Valid company_id is required"),
];

/**
 * Middleware to ensure at least one field is present in body
 */
export const atLeastOneFieldPresent = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const allowedFields = [
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

  const hasAtLeastOne = allowedFields.some((field) => field in req.body);

  if (!hasAtLeastOne) {
    return res.status(400).json({
      error: "At least one field must be provided to update the job.",
    });
  }

  next();
};

/**
 * Validation rules for updating a job
 */
export const updateJobValidationRules: ValidationChain[] = [
  body("title")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Title must be a non-empty string"),

  body("description")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Description must be a non-empty string"),

  body("industry")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Industry must be a non-empty string"),

  body("type")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Type must be a non-empty string")
    .isIn([
      "Full-time",
      "Part-time",
      "Contract",
      "Temporary",
      "Volunteer",
      "Internship",
      "Other",
    ])
    .withMessage(
      "Invalid type. Allowed values: Full-time, Part-time, Contract, Temporary, Volunteer, Internship, Other"
    ),

  body("experience_level")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Experience level must be a non-empty string")
    .isIn(["Internship", "Entry", "Associate", "Mid", "Director"])
    .withMessage(
      "Invalid experience level. Allowed values: Internship, Entry, Associate, Mid, Director"
    ),

  body("location")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Location must be a non-empty string"),

  body("workplace_type")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Workplace type must be a non-empty string")
    .isIn(["On-site", "Hybrid", "Remote"])
    .withMessage(
      "Invalid workplace type. Allowed values: On-site, Hybrid, Remote"
    ),

  body("salary_min_range")
    .optional()
    .isNumeric()
    .withMessage("Salary min range must be a valid number")
    .custom((value) => value >= 0)
    .withMessage("Salary min range must be at least 0"),

  body("salary_max_range")
    .optional()
    .isNumeric()
    .withMessage("Salary max range must be a valid number")
    .custom((salary_max_range, { req }) => {
      if (
        req.body.salary_min_range &&
        Number(salary_max_range) < Number(req.body.salary_min_range)
      ) {
        throw new Error(
          "Salary max range must be greater than or equal to salary min range"
        );
      }
      return true;
    }),
];

/**
 * Validation rules for job application
 */
export const jobApplicationValidationRules: ValidationChain[] = [
  // Email
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  // Phone
  body("phone")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid phone number format"),

  // Validate resume file
  body("resume").custom((_, { req }) => {
    // Check if file is provided
    if (!req.file) {
      throw new Error("Resume file is required");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      throw new Error("File size exceeds 5MB limit");
    }

    // Validate file type (only PDF)
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("Invalid file type. Only PDF files are allowed");
    }

    return true;
  }),
];

/**
 * Validation rules for job application status update
 */
export const jobApplicationStatusUpdateValidationRules: ValidationChain[] = [
  // Status
  body("status")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Pending", "Viewed", "Rejected", "Accepted"])
    .withMessage(
      "Invalid status. Allowed values: Pending, Viewed, Rejected, Accepted"
    ),
];

/**
 * Validation rules for job reporting
 */
export const jobReportValidationRules: ValidationChain[] = [
  // Reason
  body("reason").isString().trim().notEmpty().withMessage("Reason is required"),
];
