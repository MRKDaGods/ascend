import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload | {
        id: number;
        isService: boolean;
    };
}
/**
 * Authentices JWT token from bearer token in Authorization header
 *
 * @returns HTTP response
 * - 401 if no token provided
 * - 403 if token is invalid
 */
declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default authenticateToken;
