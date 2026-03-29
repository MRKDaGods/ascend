"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileValidationRules = exports.validateFileSize = void 0;
const express_validator_1 = require("express-validator");
/**
 * Ensures the file size is less than or equal to 5MB
 */
const validateFileSize = (fileSize) => {
    return fileSize <= 5 * 1024 * 1024;
};
exports.validateFileSize = validateFileSize;
exports.uploadFileValidationRules = [
    (0, express_validator_1.body)("file").custom((_, { req }) => {
        if (!req.file) {
            throw new Error("File is required");
        }
        if (!(0, exports.validateFileSize)(req.file.size)) {
            throw new Error("File size exceeds 5MB limit");
        }
        return true;
    }),
];
