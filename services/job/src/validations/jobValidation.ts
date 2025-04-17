import { body, ValidationChain } from "express-validator";

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
    .custom((salary_range_max, { req }) => {
      if (
        req.body.salary_range_min &&
        Number(salary_range_max) < Number(req.body.salary_range_min)
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
