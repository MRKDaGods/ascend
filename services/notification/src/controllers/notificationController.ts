import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { Response } from "express";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationService";

/**
 * Gets the authenticated user's notifications
 *
 * @param req (page)
 *
 * @returns HTTP response
 * - 200 with the user's notifications
 * - 500 if server error occurrs
 **/
export const getUserNotifications = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  try {
    const page = parseInt(req.query.page as string) || 1;
    const notifications = await getNotifications(userId, page);
    res.json(notifications);
  } catch (error) {
    console.error("Failed to get notifications:", error);
    res.status(500).send("Failed to get notifications");
  }
};

/**
 * Marks a notification as read
 *
 * @param req
 *
 * @returns HTTP response
 * - 200 if successful
 * - 500 if server error occurrs
 **/
export const markAsRead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  try {
    const notificationId = parseInt(req.params.id);
    await markNotificationAsRead(userId, notificationId);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    res.status(500).send("Failed to mark notification as read");
  }
};
