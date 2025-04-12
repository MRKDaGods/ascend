import { body, param, query, ValidationChain } from "express-validator";

// Post Creation and Update
export const createPostValidationRules: ValidationChain[] = [
  body("content")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 5000 })
    .withMessage("Content must not exceed 5000 characters"),
  body("privacy")
    .isIn(["public", "connections", "private"])
    .withMessage("Invalid privacy setting"),
  body("type")
    .optional()
    .isIn(["image", "video", "document", "link"])
    .withMessage("Invalid media type"),
  body("title")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title must not exceed 200 characters"),
  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
];

export const updatePostValidationRules: ValidationChain[] = [
  param("postId").isInt().withMessage("Invalid post ID"),
  body("content")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Content must not exceed 5000 characters"),
  body("privacy")
    .optional()
    .isIn(["public", "connections", "private"])
    .withMessage("Invalid privacy setting"),
];

// Comment Validation
export const commentValidationRules: ValidationChain[] = [
  param("postId").isInt().withMessage("Invalid post ID"),
  body("content")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ max: 1000 })
    .withMessage("Comment must not exceed 1000 characters"),
  body("parentCommentId")
    .optional()
    .isInt()
    .withMessage("Invalid parent comment ID"),
];

// Share Validation
export const sharePostValidationRules: ValidationChain[] = [
  param("postId").isInt().withMessage("Invalid post ID"),
  body("comment")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comment must not exceed 1000 characters"),
  body("privacy")
    .isIn(["public", "connections", "private"])
    .withMessage("Invalid privacy setting"),
];

// Tag Users Validation
export const tagUsersValidationRules: ValidationChain[] = [
  param("postId").isInt().withMessage("Invalid post ID"),
  body("userIds")
    .isArray()
    .withMessage("User IDs must be an array")
    .notEmpty()
    .withMessage("At least one user ID is required"),
  body("userIds.*").isInt().withMessage("Invalid user ID"),
  body("commentId").optional().isInt().withMessage("Invalid comment ID"),
];

// Search Validation
export const searchValidationRules: ValidationChain[] = [
  query("q")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Search query must be between 2 and 100 characters"),
  query("page").optional().isInt({ min: 1 }).withMessage("Invalid page number"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Invalid limit (1-50)"),
];

// Media Upload Validation
export const mediaUploadValidationRules: ValidationChain[] = [
  body("type")
    .isIn(["image", "video", "document", "link"])
    .withMessage("Invalid media type"),
  body("file").custom((_, { req }) => {
    if (!req.file && req.body.type !== "link") {
      throw new Error("File is required for non-link media");
    }

    if (req.file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (req.file.size > maxSize) {
        throw new Error("File size exceeds 10MB limit");
      }

      const allowedTypes = {
        image: ["image/jpeg", "image/png", "image/gif"],
        video: ["video/mp4", "video/quicktime"],
        document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      };

      const mediaType = req.body.type as keyof typeof allowedTypes;
      if (!allowedTypes[mediaType]?.includes(req.file.mimetype)) {
        throw new Error(`Invalid file type for ${req.body.type}`);
      }
    }

    return true;
  }),
  body("url")
    .if(body("type").equals("link"))
    .isURL()
    .withMessage("Valid URL is required for link type media"),
];