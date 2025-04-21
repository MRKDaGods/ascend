import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";

export const checkUserIsAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user!.id === 14) {
    next();
  } else {
    return res.status(403).json({
      error: "You are not authorized to access this resource.",
    });
  }
};
