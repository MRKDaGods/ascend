import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | { id: number, isService: boolean };
}

/**
 * Authentices JWT token from bearer token in Authorization header
 *
 * @returns HTTP response
 * - 401 if no token provided
 * - 403 if token is invalid
 */
const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  try {
    // Verify token and assign to Req::user
    req.user = verifyToken(token);

    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

export default authenticateToken;
