"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
/**
 * Validates the request body against the given validation rules.
 *
 * @returns HTTP response
 * - 400 if validation fails
 */
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.default = validate;
