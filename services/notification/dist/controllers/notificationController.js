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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAsUnread = exports.markAsRead = exports.getUserNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
/**
 * Gets the authenticated user's notifications
 *
 * @param req (page)
 *
 * @returns HTTP response
 * - 200 with the user's notifications
 * - 500 if server error occurrs
 **/
const getUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const page = parseInt(req.query.page) || 1;
        const notifications = yield (0, notificationService_1.getNotifications)(userId, page);
        res.json(notifications);
    }
    catch (error) {
        console.error("Failed to get notifications:", error);
        res.status(500).send("Failed to get notifications");
    }
});
exports.getUserNotifications = getUserNotifications;
/**
 * Marks a notification as read
 *
 * @param req
 *
 * @returns HTTP response
 * - 200 if successful
 * - 500 if server error occurrs
 **/
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const notificationId = parseInt(req.params.id);
        yield (0, notificationService_1.markNotificationAsRead)(userId, notificationId);
        res.json({ message: "Notification marked as read" });
    }
    catch (error) {
        console.error("Failed to mark notification as read:", error);
        res.status(500).send("Failed to mark notification as read");
    }
});
exports.markAsRead = markAsRead;
/**
 * Marks a notification as unread
 *
 * @param req
 *
 * @returns HTTP response
 * - 200 if successful
 * - 500 if server error occurrs
 **/
const markAsUnread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const notificationId = parseInt(req.params.id);
        yield (0, notificationService_1.markNotificationAsUnread)(userId, notificationId);
        res.json({ message: "Notification marked as unread" });
    }
    catch (error) {
        console.error("Failed to mark notification as unread:", error);
        res.status(500).send("Failed to mark notification as unread");
    }
});
exports.markAsUnread = markAsUnread;
/**
 * Deletes a notification
 *
 * @param req
 *
 * @returns HTTP response
 * - 200 if successful
 * - 500 if server error occurrs
 **/
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const notificationId = parseInt(req.params.id);
        yield (0, notificationService_1.deleteNotification)(userId, notificationId);
        res.json({ message: "Notification deleted" });
    }
    catch (error) {
        console.error("Failed to delete notification:", error);
        res.status(500).send("Failed to delete notification");
    }
});
exports.deleteNotification = deleteNotification;
