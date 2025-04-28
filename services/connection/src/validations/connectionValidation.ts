import { body } from 'express-validator';

export const connectionRequestValidationRules = [
  body('userId')
    .isInt()
    .withMessage('User ID must be an integer')
    .notEmpty()
    .withMessage('User ID is required'),
  body('message')
    .optional()
    .isString()
    .withMessage('Message must be a string')
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
];

export const messageRequestValidationRules = [
  body('userId')
    .isInt()
    .withMessage('User ID must be an integer')
    .notEmpty()
    .withMessage('User ID is required'),
  body('message')
    .isString()
    .withMessage('Message must be a string')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
];

export const preferencesValidationRules = [
  body('allowConnectionRequests')
    .optional()
    .isBoolean()
    .withMessage('allowConnectionRequests must be a boolean'),
  body('allowMessageRequests')
    .optional()
    .isBoolean()
    .withMessage('allowMessageRequests must be a boolean'),
  body('allowFollowers')
    .optional()
    .isBoolean()
    .withMessage('allowFollowers must be a boolean'),
  body('autoAcceptConnectionRequests')
    .optional()
    .isBoolean()
    .withMessage('autoAcceptConnectionRequests must be a boolean'),
  body('autoAcceptMessageRequests')
    .optional()
    .isBoolean()
    .withMessage('autoAcceptMessageRequests must be a boolean'),
];