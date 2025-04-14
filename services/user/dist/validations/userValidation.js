"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadResumeValidationRules = exports.uploadCoverPhotoValidationRules = exports.uploadProfilePictureValidationRules = exports.updateUserProfileValidationRules = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validation rules for updating a user profile
 */
exports.updateUserProfileValidationRules = [
    // Profile
    (0, express_validator_1.body)("first_name")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ max: 50 }),
    (0, express_validator_1.body)("last_name")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ max: 50 }),
    (0, express_validator_1.body)("industry").optional().isString().trim().isLength({ max: 50 }),
    (0, express_validator_1.body)("location").optional().isString().trim().isLength({ max: 100 }),
    (0, express_validator_1.body)("bio").optional().isString().trim(),
    (0, express_validator_1.body)("privacy").optional().isIn(["public", "private", "connections"]),
    (0, express_validator_1.body)("show_school").optional().isBoolean(),
    (0, express_validator_1.body)("show_current_company").optional().isBoolean(),
    (0, express_validator_1.body)("website").optional().isURL().isLength({ max: 255 }),
    (0, express_validator_1.body)("additional_name").optional().isString().trim().isLength({ max: 50 }),
    (0, express_validator_1.body)("name_pronunciation")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 100 }),
    // Skills
    (0, express_validator_1.body)("skills").optional().isArray(),
    (0, express_validator_1.body)("skills.*.name")
        .if((0, express_validator_1.body)("skills").exists())
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Skill name is required")
        .isLength({ max: 50 }),
    // Education
    (0, express_validator_1.body)("education").optional().isArray(),
    (0, express_validator_1.body)("education.*.school")
        .if((0, express_validator_1.body)("education").exists())
        .isString()
        .trim()
        .notEmpty()
        .withMessage("School is required for education")
        .isLength({ max: 100 }),
    (0, express_validator_1.body)("education.*.degree")
        .if((0, express_validator_1.body)("education").exists())
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Degree is required for education")
        .isLength({ max: 50 }),
    (0, express_validator_1.body)("education.*.field_of_study")
        .if((0, express_validator_1.body)("education").exists())
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Field of study is required for education")
        .isLength({ max: 50 }),
    (0, express_validator_1.body)("education.*.start_date")
        .if((0, express_validator_1.body)("education").exists())
        .isISO8601()
        .withMessage("Valid start date is required for education"),
    (0, express_validator_1.body)("education.*.end_date")
        .optional()
        .isISO8601()
        .withMessage("Valid end date is required for education"),
    // Experience
    (0, express_validator_1.body)("experience").optional().isArray(),
    (0, express_validator_1.body)("experience.*.company")
        .if((0, express_validator_1.body)("experience").exists())
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Company is required for experience")
        .isLength({ max: 100 }),
    (0, express_validator_1.body)("experience.*.position")
        .if((0, express_validator_1.body)("experience").exists())
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Position is required for experience")
        .isLength({ max: 100 }),
    (0, express_validator_1.body)("experience.*.start_date")
        .if((0, express_validator_1.body)("experience").exists())
        .isISO8601()
        .withMessage("Valid start date is required for experience"),
    (0, express_validator_1.body)("experience.*.end_date")
        .optional()
        .isISO8601()
        .withMessage("Valid end date is required for experience"),
    (0, express_validator_1.body)("experience.*.description").optional().isString(),
    // Interests
    (0, express_validator_1.body)("interests").optional().isArray(),
    (0, express_validator_1.body)("interests.*.name")
        .if((0, express_validator_1.body)("interests").exists())
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 50 }),
    // Projects
    (0, express_validator_1.body)("projects").optional().isArray(),
    (0, express_validator_1.body)("projects.*.name")
        .if((0, express_validator_1.body)("projects").exists())
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Project name is required")
        .isLength({ max: 100 }),
    (0, express_validator_1.body)("projects.*.description")
        .if((0, express_validator_1.body)("projects").exists())
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Project description is required"),
    (0, express_validator_1.body)("projects.*.start_date")
        .if((0, express_validator_1.body)("projects").exists())
        .isISO8601()
        .withMessage("Valid start date is required for project"),
    (0, express_validator_1.body)("projects.*.end_date")
        .optional()
        .isISO8601()
        .withMessage("Valid end date is required for project"),
    (0, express_validator_1.body)("projects.*.url").optional().isURL().isLength({ max: 255 }),
    // Courses
    (0, express_validator_1.body)("courses").optional().isArray(),
    (0, express_validator_1.body)("courses.*.name")
        .if((0, express_validator_1.body)("courses").exists())
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Course name is required")
        .isLength({ max: 100 }),
    (0, express_validator_1.body)("courses.*.provider")
        .if((0, express_validator_1.body)("courses").exists())
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Course provider is required")
        .isLength({ max: 100 }),
    (0, express_validator_1.body)("courses.*.completion_date")
        .optional()
        .isISO8601()
        .withMessage("Valid completion date is required for course"),
    // Contact info
    (0, express_validator_1.body)("contact_info").optional().isObject(),
    (0, express_validator_1.body)("contact_info.profile_url").optional().isURL().isLength({ max: 255 }),
    (0, express_validator_1.body)("contact_info.email")
        .if((0, express_validator_1.body)("contact_info").exists())
        .isEmail()
        .withMessage("Valid email address is required for contact info")
        .isLength({ max: 255 }),
    (0, express_validator_1.body)("contact_info.phone")
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .isLength({ max: 20 }),
    (0, express_validator_1.body)("contact_info.phone_type")
        .optional()
        .isIn(["mobile", "home", "work"])
        .withMessage("Invalid phone type"),
    (0, express_validator_1.body)("contact_info.address")
        .optional()
        .isString()
        .trim()
        .isLength({ max: 255 }),
    (0, express_validator_1.body)("contact_info.birthday")
        .optional()
        .isISO8601()
        .withMessage("Valid birthday is required for contact info"),
];
/**
 * Validation rules for uploading a profile picture
 */
exports.uploadProfilePictureValidationRules = [
    (0, express_validator_1.body)("file").custom((_, { req }) => {
        if (!req.file) {
            throw new Error("File is required");
        }
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (req.file.size > maxSize) {
            throw new Error("File size exceeds 5MB limit");
        }
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new Error("Only JPEG, PNG files are allowed");
        }
        // Validate context
        if (req.body.context !== "profile_picture") {
            throw new Error("Invalid context");
        }
        return true;
    }),
];
/**
 * Validation rules for uploading a cover photo
 */
exports.uploadCoverPhotoValidationRules = [
    (0, express_validator_1.body)("file").custom((_, { req }) => {
        if (!req.file) {
            throw new Error("File is required");
        }
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (req.file.size > maxSize) {
            throw new Error("File size exceeds 5MB limit");
        }
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new Error("Only JPEG, PNG files are allowed");
        }
        // Validate context
        if (req.body.context !== "cover_photo") {
            throw new Error("Invalid context");
        }
        return true;
    }),
];
/**
 * Validation rules for uploading a resume
 */
exports.uploadResumeValidationRules = [
    (0, express_validator_1.body)("file").custom((_, { req }) => {
        if (!req.file) {
            throw new Error("File is required");
        }
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (req.file.size > maxSize) {
            throw new Error("File size exceeds 5MB limit");
        }
        // Validate file type
        const allowedTypes = ["application/pdf"];
        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new Error("Only PDF files are allowed");
        }
        // Validate context
        if (req.body.context !== "resume") {
            throw new Error("Invalid context");
        }
        return true;
    }),
];
