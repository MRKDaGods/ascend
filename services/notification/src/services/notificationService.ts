import db from "@shared/config/db";
import {
  AuthGetAdminPayload,
  callRPC,
  Events,
  getRPCQueueName,
  AuthFCMTokenPayload,
  UserProfilePicPayload,
  UserProfilePayload,
} from "@shared/rabbitMQ";
import { Notification, NotificationType } from "@shared/models";
import { Services } from "@ascend/shared";

/**
 * Creates a new notification for a user
 *
 * @param userId - The user ID to create the notification for
 * @param type - The type of notification
 * @param message - The message to display in the notification
 * @param payload - Additional data to include in the notification
 */
export const createNotification = async (
  userId: number,
  type: NotificationType,
  message: string,
  payload: Record<string, any> = {}
): Promise<void> => {
  await db.query(
    `INSERT INTO notification_service.notifications (user_id, type, message, payload) 
     VALUES ($1, $2, $3, $4)`,
    [userId, type, message, JSON.stringify(payload)]
  );

  // Get FCM token if available
  const fcmRpcQueue = getRPCQueueName(Services.AUTH, Events.AUTH_FCM_TOKEN_RPC);
  const fcmRpcPayload: AuthFCMTokenPayload.Request = {
    user_id: userId,
  };
  const fcmToken = await callRPC<AuthFCMTokenPayload.Response>(
    fcmRpcQueue,
    fcmRpcPayload
  );
  if (fcmToken) {
    // send...
  }
};

/**
 * Retrieves a list of notifications for a user
 *
 * @param userId - The user ID to retrieve notifications for
 * @param page - The page number to retrieve
 * @param limit - The number of notifications per page
 * @returns A list of notifications
 */
export const getNotifications = async (
  userId: number,
  page?: number | undefined,
  limit?: number | undefined
): Promise<Notification[]> => {
  page = page || 1;
  limit = limit || 10;

  const offset = (page - 1) * limit;
  const result = await db.query(
    `SELECT * FROM notification_service.notifications 
     WHERE user_id = $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  // Process each notification to add profile pictures for user IDs in payload
  for (const notification of result.rows) {
    if (notification.payload) {
      // Find all keys in payload that end with user_id
      const userIdKeys = Object.keys(notification.payload).filter((key) =>
        key.endsWith("user_id")
      );

      // For each user found, fetch profile
      for (const key of userIdKeys) {
        const relatedUserId = notification.payload[key];
        if (relatedUserId) {
          const profileKey = key.replace("user_id", "profile");

          try {
            // Get user profile
            const profileRpcQueue = getRPCQueueName(
              Services.USER,
              Events.USER_PROFILE_RPC
            );
            const payload: UserProfilePayload.Request = {
              user_id: relatedUserId,
            };
            const profileRes = await callRPC<UserProfilePayload.Response>(
              profileRpcQueue,
              payload
            );

            // Add profile picture to payload
            if (profileRes && profileRes.profile) {
              notification.payload[profileKey] = profileRes.profile;
            }
          } catch (error) {
            console.error(
              `Failed to fetch profile for user ${relatedUserId}:`,
              error
            );
          }
        }
      }
    }
  }

  return result.rows;
};

/**
 * Marks a notification as read
 *
 * @param userId - The user ID to mark the notification as read for
 * @param notificationId - The ID of the notification to mark as read
 */
export const markNotificationAsRead = async (
  userId: number,
  notificationId: number
): Promise<void> => {
  const result = await db.query(
    `UPDATE notification_service.notifications 
     SET is_read = TRUE 
     WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  );

  if (result.rowCount === 0) {
    throw new Error("Notification not found");
  }
};

/**
 * Marks a notification as unread
 *
 * @param userId - The user ID to mark the notification as unread for
 * @param notificationId - The ID of the notification to mark as unread
 */
export const markNotificationAsUnread = async (
  userId: number,
  notificationId: number
): Promise<void> => {
  const result = await db.query(
    `UPDATE notification_service.notifications 
     SET is_read = FALSE 
     WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  );

  if (result.rowCount === 0) {
    throw new Error("Notification not found");
  }
}

/**
 * Deletes a notification
 *
 * @param userId - The user ID to delete the notification for
 * @param notificationId - The ID of the notification to be deleted
 */
export const deleteNotification = async (
  userId: number,
  notificationId: number
): Promise<void> => {
  await db.query(
    `DELETE FROM notification_service.notifications
     WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  );
};

export const sendWelcomeNotification = async (
  userId: number
): Promise<void> => {
  console.log(`Sending welcome notification to user ${userId}`);

  // Get admin user ID
  const adminRpcQueue = getRPCQueueName(
    Services.AUTH,
    Events.AUTH_GET_ADMIN_RPC
  );
  const response = await callRPC<AuthGetAdminPayload.Response>(
    adminRpcQueue,
    {}
  );
  if (!response) {
    throw new Error("Failed to get admin user ID");
  }

  // Create welcome notification
  await createNotification(
    userId,
    NotificationType.WELCOME,
    "Welcome to Ascend!",
    {
      user_id: response.user_id,
    }
  );
};
