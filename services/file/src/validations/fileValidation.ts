import { body, ValidationChain } from "express-validator";

/**
 * Ensures the file size is less than or equal to 5MB
 */
export const validateFileSize = (fileSize: number) => {
  return fileSize <= 5 * 1024 * 1024;
};

export const uploadFileValidationRules: ValidationChain[] = [
  body("file").custom((_, { req }) => {
    if (!req.file) {
      throw new Error("File is required");
    }

    if (!validateFileSize(req.file.size)) {
      throw new Error("File size exceeds 5MB limit");
    }

    return true;
  }),
];
