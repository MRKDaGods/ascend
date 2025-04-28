import { body, ValidationChain } from "express-validator";

export const messageValidationRules: ValidationChain[] = [
  // Validate content
  body("content").optional().isString().withMessage("Content must be a string"),

  // Validate file
  body("file").custom((_, { req }) => {
    if (!req.file) {
      // Skip validation if no file is provided
      return true;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (req.file.size > maxSize) {
      throw new Error("File size exceeds 5MB limit");
    }

    // Validate file type (image, video, document)
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "video/mp4",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("Invalid file type");
    }

    return true;
  }),
];
