import { body, ValidationChain } from "express-validator";

/**
 * Validation rules for creating a new job
 */
export const newJobValidationRules: ValidationChain[] = [
    // Title
    body("title")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 255 })
        .withMessage("Title must be at most 255 characters"),

    // Description
    body("description")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    // Location
    body("location")
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Location is required")
        .isLength({ max: 255 })
        .withMessage("Location must be at most 255 characters"),

    // Industry
    body("industry")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Industry is required")
        .isLength({ max: 255 })
        .withMessage("Industry must be at most 255 characters"),

    // Experience Level
    body("experience_level")
        .isIn(["Internship", "Entry Level", "Associate", "Mid-Senior Level", "Director"])
        .withMessage("Invalid experience level. Allowed values: Internship, Entry Level, Associate, Mid-Senior Level, Director"),

    // Salary Range Min
    body("salary_range_min")
        .optional()
        .isNumeric()
        .withMessage("Salary range min must be a valid number")
        .custom(value => value >= 0)
        .withMessage("Salary range min must be at least 0"),

    // Salary Range Max
    body("salary_range_max")
        .optional()
        .isNumeric()
        .withMessage("Salary range max must be a valid number")
        .custom((value, { req }) => {
            if (req.body.salary_range_min && Number(value) < Number(req.body.salary_range_min)) {
                throw new Error("Salary range max must be greater than or equal to salary range min");
            }
            return true;
        }),

    // Company ID (Required Foreign Key)
    body("company_id")
        .isInt({ gt: 0 })
        .withMessage("Valid company_id is required"),

    // Posted By (Required Foreign Key)
    body("posted_by")
        .isInt({ gt: 0 })
        .withMessage("Valid posted_by user ID is required"),
];