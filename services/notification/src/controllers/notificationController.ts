import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { Response } from "express";
import {
  deleteNotification as serviceDeleteNotification,
  getNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
  createNotification,
} from "../services/notificationService";
import { NotificationType } from "@shared/models/notification";

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

/**
 * Marks a notification as unread
 *
 * @param req
 *
 * @returns HTTP response
 * - 200 if successful
 * - 500 if server error occurrs
 **/
export const markAsUnread = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  try {
    const notificationId = parseInt(req.params.id);
    await markNotificationAsUnread(userId, notificationId);
    res.json({ message: "Notification marked as unread" });
  } catch (error) {
    console.error("Failed to mark notification as unread:", error);
    res.status(500).send("Failed to mark notification as unread");
  }
};

/**
 * Deletes a notification
 *
 * @param req
 *
 * @returns HTTP response
 * - 200 if successful
 * - 500 if server error occurrs
 **/
export const deleteNotification = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  try {
    const notificationId = parseInt(req.params.id);
    await serviceDeleteNotification(userId, notificationId);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Failed to delete notification:", error);
    res.status(500).send("Failed to delete notification");
  }
};

export const sendNotification = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { user_id, type, message, payload, title } = req.body;
    const payloadObj = payload ? JSON.parse(payload) : {};
    await createNotification(
      parseInt(user_id),
      type as NotificationType,
      message,
      payloadObj,
      title
    );

    res.json({ message: "Sent!" });
  } catch (error) {
    console.error("Failed to send notification:", error);
    res.status(500).send("Failed to send notification");
  }
};
