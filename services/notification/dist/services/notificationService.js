"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeNotification = exports.deleteNotification = exports.markNotificationAsUnread = exports.markNotificationAsRead = exports.getNotifications = exports.createNotification = void 0;
const db_1 = __importDefault(require("@shared/config/db"));
const rabbitMQ_1 = require("@shared/rabbitMQ");
const models_1 = require("@shared/models");
const shared_1 = require("@ascend/shared");
/**
 * Creates a new notification for a user
 *
 * @param userId - The user ID to create the notification for
 * @param type - The type of notification
 * @param message - The message to display in the notification
 * @param payload - Additional data to include in the notification
 */
const createNotification = (userId_1, type_1, message_1, ...args_1) => __awaiter(void 0, [userId_1, type_1, message_1, ...args_1], void 0, function* (userId, type, message, payload = {}) {
    yield db_1.default.query(`INSERT INTO notification_service.notifications (user_id, type, message, payload) 
     VALUES ($1, $2, $3, $4)`, [userId, type, message, JSON.stringify(payload)]);
    // Get FCM token if available
    const fcmRpcQueue = (0, rabbitMQ_1.getRPCQueueName)(shared_1.Services.AUTH, rabbitMQ_1.Events.AUTH_FCM_TOKEN_RPC);
    const fcmRpcPayload = {
        user_id: userId,
    };
    const fcmToken = yield (0, rabbitMQ_1.callRPC)(fcmRpcQueue, fcmRpcPayload);
    if (fcmToken) {
        // send...
    }
});
exports.createNotification = createNotification;
/**
 * Retrieves a list of notifications for a user
 *
 * @param userId - The user ID to retrieve notifications for
 * @param page - The page number to retrieve
 * @param limit - The number of notifications per page
 * @returns A list of notifications
 */
const getNotifications = (userId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    page = page || 1;
    limit = limit || 10;
    const offset = (page - 1) * limit;
    const result = yield db_1.default.query(`SELECT * FROM notification_service.notifications 
     WHERE user_id = $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`, [userId, limit, offset]);
    // Process each notification to add profile pictures for user IDs in payload
    for (const notification of result.rows) {
        if (notification.payload) {
            // Find all keys in payload that end with user_id
            const userIdKeys = Object.keys(notification.payload).filter((key) => key.endsWith("user_id"));
            // For each user found, fetch profile
            for (const key of userIdKeys) {
                const relatedUserId = notification.payload[key];
                if (relatedUserId) {
                    const profileKey = key.replace("user_id", "profile");
                    try {
                        // Get user profile
                        const profileRpcQueue = (0, rabbitMQ_1.getRPCQueueName)(shared_1.Services.USER, rabbitMQ_1.Events.USER_PROFILE_RPC);
                        const payload = {
                            user_id: relatedUserId,
                        };
                        const profileRes = yield (0, rabbitMQ_1.callRPC)(profileRpcQueue, payload);
                        // Add profile picture to payload
                        if (profileRes && profileRes.profile) {
                            notification.payload[profileKey] = profileRes.profile;
                        }
                    }
                    catch (error) {
                        console.error(`Failed to fetch profile for user ${relatedUserId}:`, error);
                    }
                }
            }
        }
    }
    return result.rows;
});
exports.getNotifications = getNotifications;
/**
 * Marks a notification as read
 *
 * @param userId - The user ID to mark the notification as read for
 * @param notificationId - The ID of the notification to mark as read
 */
const markNotificationAsRead = (userId, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(`UPDATE notification_service.notifications 
     SET is_read = TRUE 
     WHERE id = $1 AND user_id = $2`, [notificationId, userId]);
    if (result.rowCount === 0) {
        throw new Error("Notification not found");
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
/**
 * Marks a notification as unread
 *
 * @param userId - The user ID to mark the notification as unread for
 * @param notificationId - The ID of the notification to mark as unread
 */
const markNotificationAsUnread = (userId, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(`UPDATE notification_service.notifications 
     SET is_read = FALSE 
     WHERE id = $1 AND user_id = $2`, [notificationId, userId]);
    if (result.rowCount === 0) {
        throw new Error("Notification not found");
    }
});
exports.markNotificationAsUnread = markNotificationAsUnread;
/**
 * Deletes a notification
 *
 * @param userId - The user ID to delete the notification for
 * @param notificationId - The ID of the notification to be deleted
 */
const deleteNotification = (userId, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.query(`DELETE FROM notification_service.notifications
     WHERE id = $1 AND user_id = $2`, [notificationId, userId]);
});
exports.deleteNotification = deleteNotification;
const sendWelcomeNotification = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Sending welcome notification to user ${userId}`);
    // Get admin user ID
    const adminRpcQueue = (0, rabbitMQ_1.getRPCQueueName)(shared_1.Services.AUTH, rabbitMQ_1.Events.AUTH_GET_ADMIN_RPC);
    const response = yield (0, rabbitMQ_1.callRPC)(adminRpcQueue, {});
    if (!response) {
        throw new Error("Failed to get admin user ID");
    }
    // Create welcome notification
    yield (0, exports.createNotification)(userId, models_1.NotificationType.WELCOME, "Welcome to Ascend!", {
        user_id: response.user_id,
    });
});
exports.sendWelcomeNotification = sendWelcomeNotification;
