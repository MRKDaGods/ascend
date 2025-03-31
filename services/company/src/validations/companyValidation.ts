import {body, query, param, ValidationChain } from "express-validator";

export const createCompanyValidation : ValidationChain[] = [
    body("name").exists().withMessage("'name' is required").isString()
    .trim().notEmpty().withMessage("'name' cannot be empty")
    .isLength({min : 3, max : 50}).withMessage("'name' length must be between 3 and 50"),

    body("industry").exists().withMessage("'industry' is required").isString()
    .trim().notEmpty().withMessage("'industry' cannot be empty")
    .isLength({max : 50}).withMessage("'industry' length cannot exceede 50"),

    body("description").exists().withMessage("'description' is required").isString()
    .trim().notEmpty().withMessage("'description' cannot be empty"),

    body("logoUrl").exists().withMessage("'logoUrl' is required").isString().trim()
    .notEmpty().withMessage("'logoUrl' cannot be empty").isURL()
    .withMessage("'logoUrl' must be a valid URL"),

    body("location").exists().withMessage("'location' is required").isString().trim()
    .notEmpty().withMessage("'location' cannot be empty")
    .isLength({max : 50}).withMessage("'location' length cannot exceede 50")
];

export const companyIdValidation : ValidationChain[] = [
    param("companyId").isInt({ min : 1}).withMessage("'companyId' can only be a positive integer")
];

export const updateCompanyValidation : ValidationChain[] = [
    body("industry").optional().isString()
    .trim().notEmpty().withMessage("'industry' cannot be empty")
    .isLength({max : 50}).withMessage("'industry' length cannot exceede 50"),

    body("description").optional().isString()
    .trim().notEmpty().withMessage("'description' cannot be empty"),

    body("logoUrl").optional().isString().trim()
    .notEmpty().withMessage("'logoUrl' cannot be empty").isURL()
    .withMessage("'logoUrl' must be a valid URL"),

    body("location").optional().isString().trim()
    .notEmpty().withMessage("'location' cannot be empty")
    .isLength({max : 50}).withMessage("'location' length cannot exceede 50")
];

export const createJobValidation : ValidationChain[] = [
    body("title").exists().withMessage("'title' is required").isString()
    .trim().notEmpty().withMessage("'title' cannot be empty")
    .isLength({max : 50}).withMessage("'title' length must be between 3 and 50"),

    body("industry").exists().withMessage("'industry' is required").isString()
    .trim().notEmpty().withMessage("'industry' cannot be empty")
    .isLength({max : 50}).withMessage("'industry' length cannot exceede 50"),

    body("description").exists().withMessage("'description' is required").isString()
    .trim().notEmpty().withMessage("'description' cannot be empty"),

    body("location").optional().isString().trim()
    .notEmpty().withMessage("'location' cannot be empty")
    .isLength({max : 50}).withMessage("'location' length cannot exceede 50"),

    body("salary_range_max").optional().isInt({min : 1})
    .withMessage("'salary_range_max' can only be a positive integer"),

    body("salary_range_min").optional().isInt({min : 1})
    .withMessage("'salary_range_min' can only be a positive integer"),

    body("experience_level").exists().withMessage("'experience_level' is required").isString().trim()
    .notEmpty().withMessage("'experience_level' cannot be empty")
    .isIn(["student", "entry level", "associate", "mid-senior level", "director", "executive"])
    .withMessage("'experience_level' can have on of the following values : 'student', 'entry level', 'associate', 'mid-senior level', 'director', 'executive'")
];

export const jobIdValidation : ValidationChain[] = [
    param("jobId").isInt({ min : 1}).withMessage("'jobId' can only be a positive integer")
];

export const createAnnouncementValidation : ValidationChain[] = [
    body("content").exists().withMessage("'content' is required").isString().trim()
    .notEmpty().withMessage("'content' cannot be empty")
];

export const announcementIdValidation : ValidationChain[] = [
    param("announcementId").isInt({ min : 1}).withMessage("'announcementId' can only be a positive integer")
];

export const limitAndPageValidation : ValidationChain[] = [
    query("limit").optional().isInt({min : 0}).withMessage("'limit' can only be a non-negative integer"),

    query("page").if(query("limit").exists().withMessage("missing 'limit' query parameter"))
    .isInt({min : 1}).withMessage("'page' can only be a positive integer")
];

export const updateJobApplicationValidation : ValidationChain[] = [
    query("status").exists().withMessage("'status' is required").isString().trim()
    .notEmpty().withMessage("'status' cannot be empty").isIn(["pending", "viewed", "rejected", "accepted"])
    .withMessage("'status' can only have one of the following values : 'pending', 'viewed', 'rejected', 'accepted'")
];

export const applicationIdValidation : ValidationChain[] = [
    param("applicationId").isInt({ min : 1}).withMessage("'applicationId' can only be a positive integer")
];

export const followValidation : ValidationChain[] = [
    body("first_name").exists().withMessage("'first_name' is required").isString().trim()
    .notEmpty().withMessage("'first_name' cannot be empty")
    .isLength({max : 50}).withMessage("'first_name' maxiumum length is 50"),

    body("last_name").exists().withMessage("'last_name' is required").isString().trim()
    .notEmpty().withMessage("'last_name' cannot be empty")
    .isLength({max : 50}).withMessage("'last_name' maxiumum length is 50")
];