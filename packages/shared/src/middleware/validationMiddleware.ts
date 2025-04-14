import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

/**
 * Validates the request body against the given validation rules.
 * 
 * @returns HTTP response
 * - 400 if validation fails
 */
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export default validate;
