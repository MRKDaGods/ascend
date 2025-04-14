import { Request, Response, NextFunction } from "express";
/**
 * Validates the request body against the given validation rules.
 *
 * @returns HTTP response
 * - 400 if validation fails
 */
declare const validate: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default validate;
