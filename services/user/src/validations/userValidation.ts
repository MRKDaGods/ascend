import { body, ValidationChain } from "express-validator";

/**
 * Validation rules for updating a user profile
 */
export const updateUserProfileValidationRules: ValidationChain[] = [
  // Profile
  body("first_name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 }),
  body("last_name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 }),
  body("industry").optional().isString().trim().isLength({ max: 50 }),
  body("location").optional().isString().trim().isLength({ max: 100 }),
  body("bio").optional().isString().trim(),
  body("privacy").optional().isIn(["public", "private", "connections"]),
  body("show_school").optional().isBoolean(),
  body("show_current_company").optional().isBoolean(),
  body("website").optional().isURL().isLength({ max: 255 }),
  body("additional_name").optional().isString().trim().isLength({ max: 50 }),
  body("name_pronunciation")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 }),

  // Skills
  body("skills").optional().isArray(),
  body("skills.*.name")
    .if(body("skills").exists())
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Skill name is required")
    .isLength({ max: 50 }),

  // Education
  body("education").optional().isArray(),
  body("education.*.school")
    .if(body("education").exists())
    .isString()
    .trim()
    .notEmpty()
    .withMessage("School is required for education")
    .isLength({ max: 100 }),
  body("education.*.degree")
    .if(body("education").exists())
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Degree is required for education")
    .isLength({ max: 50 }),
  body("education.*.field_of_study")
    .if(body("education").exists())
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Field of study is required for education")
    .isLength({ max: 50 }),
  body("education.*.start_date")
    .if(body("education").exists())
    .isISO8601()
    .withMessage("Valid start date is required for education"),
  body("education.*.end_date")
    .optional()
    .isISO8601()
    .withMessage("Valid end date is required for education"),

  // Experience
  body("experience").optional().isArray(),
  body("experience.*.company")
    .if(body("experience").exists())
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Company is required for experience")
    .isLength({ max: 100 }),
  body("experience.*.position")
    .if(body("experience").exists())
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Position is required for experience")
    .isLength({ max: 100 }),
  body("experience.*.start_date")
    .if(body("experience").exists())
    .isISO8601()
    .withMessage("Valid start date is required for experience"),
  body("experience.*.end_date")
    .optional()
    .isISO8601()
    .withMessage("Valid end date is required for experience"),
  body("experience.*.description").optional().isString(),

  // Interests
  body("interests").optional().isArray(),
  body("interests.*.name")
    .if(body("interests").exists())
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 50 }),

  // Projects
  body("projects").optional().isArray(),
  body("projects.*.name")
    .if(body("projects").exists())
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ max: 100 }),
  body("projects.*.description")
    .if(body("projects").exists())
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Project description is required"),
  body("projects.*.start_date")
    .if(body("projects").exists())
    .isISO8601()
    .withMessage("Valid start date is required for project"),
  body("projects.*.end_date")
    .optional()
    .isISO8601()
    .withMessage("Valid end date is required for project"),
  body("projects.*.url").optional().isURL().isLength({ max: 255 }),

  // Courses
  body("courses").optional().isArray(),
  body("courses.*.name")
    .if(body("courses").exists())
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Course name is required")
    .isLength({ max: 100 }),
  body("courses.*.provider")
    .if(body("courses").exists())
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Course provider is required")
    .isLength({ max: 100 }),
  body("courses.*.completion_date")
    .optional()
    .isISO8601()
    .withMessage("Valid completion date is required for course"),

  // Contact info
  body("contact_info").optional().isObject(),
  body("contact_info.profile_url").optional().isURL().isLength({ max: 255 }),
  body("contact_info.email")
    .if(body("contact_info").exists())
    .isEmail()
    .withMessage("Valid email address is required for contact info")
    .isLength({ max: 255 }),
  body("contact_info.phone")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 20 }),
  body("contact_info.phone_type")
    .optional()
    .isIn(["mobile", "home", "work"])
    .withMessage("Invalid phone type"),
  body("contact_info.address")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 255 }),
  body("contact_info.birthday")
    .optional()
    .isISO8601()
    .withMessage("Valid birthday is required for contact info"),
];
