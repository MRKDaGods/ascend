import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { isAdmin } from "../services/adminService";

export const isUserAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const isAdminUser = await isAdmin(userId);

    if (!isAdminUser) {
      return res.status(403).json({
        error:
          "Unauthorized: Admin privileges required to access this resource",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
