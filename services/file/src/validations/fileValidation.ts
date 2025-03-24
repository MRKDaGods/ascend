import { body, ValidationChain } from "express-validator";

export const uploadFileValidationRules: ValidationChain[] = [
  body("file").custom((_, { req }) => {
    if (!req.file) {
      throw new Error("File is required");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      throw new Error("File size exceeds 5MB limit");
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("Only JPEG, PNG, and PDF files are allowed");
    }

    return true;
  }),

  // Add more context types?
  body("context")
    .optional()
    .isIn(["profile_picture", "cover_photo", "resume"])
    .withMessage("Invalid context"),
];
