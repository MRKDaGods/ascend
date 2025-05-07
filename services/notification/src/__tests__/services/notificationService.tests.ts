import db from "@shared/config/db";
import {
  callRPC,
  Events,
  getRPCQueueName,
} from "@shared/rabbitMQ";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
  deleteNotification,
  sendWelcomeNotification,
} from "../../services/notificationService";
import { getMessaging } from "../../services/fcm";
import { NotificationType } from "@shared/models";

// Mock dependencies
jest.mock("@shared/config/db", () => ({
  query: jest.fn(),
}));

jest.mock("@shared/rabbitMQ", () => ({
  callRPC: jest.fn(),
  getRPCQueueName: jest.fn().mockReturnValue("mock-queue"),
  Events: {
    AUTH_FCM_TOKEN_RPC: "AUTH_FCM_TOKEN_RPC",
    USER_PROFILE_RPC: "USER_PROFILE_RPC",
    AUTH_GET_ADMIN_RPC: "AUTH_GET_ADMIN_RPC",
  },
  Services: {
    AUTH: "auth",
    USER: "user",
  },
  NotificationType: {
    WELCOME: "WELCOME",
  },
}));

jest.mock("../../services/fcm", () => ({
  getMessaging: jest.fn(),
}));

describe("Notification Service Tests", () => {
  const mockSend = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getMessaging as jest.Mock).mockReturnValue({ send: mockSend });
    mockSend.mockResolvedValue({});
    (db.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 0 });
    (callRPC as jest.Mock).mockResolvedValue(null);
  });

  describe("createNotification", () => {
    const userId = 123;
    const type = "TEST_NOTIFICATION" as NotificationType;
    const message = "Test message";
    const payload = { key: "value", link_url: "/test" };
    const title = "Test Title";

    it("should create a notification and save it to the database", async () => {
      (db.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 1 });
      
      await createNotification(userId, type, message, payload, title);
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO notification_service.notifications"),
        [userId, type, message, JSON.stringify(payload)]
      );
    });

    it("should not save to database when dontSave is true", async () => {
      await createNotification(userId, type, message, payload, title, true);
      
      expect(db.query).not.toHaveBeenCalled();
    });

    it("should send FCM notification when FCM token exists", async () => {
      const fcmToken = "mock-fcm-token";
      (callRPC as jest.Mock).mockResolvedValue({ fcm_token: fcmToken });
      
      await createNotification(userId, type, message, payload, title);
      
      expect(callRPC).toHaveBeenCalledWith(
        expect.any(String),
        { user_id: userId }
      );
      
      expect(mockSend).toHaveBeenCalledWith({
        token: fcmToken,
        notification: {
          title: title,
          body: message,
        },
        data: {
          title: title,
          body: message,
          link_url: payload.link_url,
        },
      });
    });

    it("should handle FCM sending errors", async () => {
      console.error = jest.fn();
      const fcmToken = "mock-fcm-token";
      (callRPC as jest.Mock).mockResolvedValue({ fcm_token: fcmToken });
      mockSend.mockRejectedValue(new Error("FCM error"));
      
      await createNotification(userId, type, message);
      
      expect(console.error).toHaveBeenCalledWith(
        "Error sending FCM message:",
        expect.any(Error)
      );
    });
  });

  describe("getNotifications", () => {
    const userId = 123;
    const mockNotifications = [
      {
        id: 1,
        user_id: userId,
        type: "TEST",
        message: "Test message 1",
        created_at: new Date(),
        is_read: false,
        payload: { commenter_user_id: 456 },
      },
      {
        id: 2,
        user_id: userId,
        type: "TEST2",
        message: "Test message 2",
        created_at: new Date(),
        is_read: true,
        payload: { sender_user_id: 789 },
      },
    ];

    it("should retrieve notifications with default pagination", async () => {
      (db.query as jest.Mock).mockResolvedValue({ rows: mockNotifications });
      
      const result = await getNotifications(userId);
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM notification_service.notifications"),
        [userId, 10, 0]
      );
      expect(result).toEqual(mockNotifications);
    });

    it("should retrieve notifications with custom pagination", async () => {
      (db.query as jest.Mock).mockResolvedValue({ rows: mockNotifications });
      
      await getNotifications(userId, 2, 20);
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM notification_service.notifications"),
        [userId, 20, 20]
      );
    });

    it("should fetch user profiles for related user IDs in notification payload", async () => {
      const mockProfile = { profile_picture: "url/to/picture" };
      (db.query as jest.Mock).mockResolvedValue({ rows: [...mockNotifications] });
      (callRPC as jest.Mock).mockResolvedValue({ profile: mockProfile });
      
      const result = await getNotifications(userId);
      
      expect(callRPC).toHaveBeenCalledTimes(2); // For the two different user IDs
      expect(result[0].payload).toHaveProperty("commenter_profile", mockProfile);
      expect(result[1].payload).toHaveProperty("sender_profile", mockProfile);
    });

    it("should handle errors when fetching user profiles", async () => {
      console.error = jest.fn();
      (db.query as jest.Mock).mockResolvedValue({ rows: [...mockNotifications] });
      (callRPC as jest.Mock).mockRejectedValue(new Error("Profile fetch error"));
      
      await getNotifications(userId);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to fetch profile for user"),
        expect.any(Error)
      );
    });
  });

  describe("markNotificationAsRead", () => {
    const userId = 123;
    const notificationId = 456;

    it("should mark notification as read", async () => {
      (db.query as jest.Mock).mockResolvedValue({ rowCount: 1 });
      
      await markNotificationAsRead(userId, notificationId);
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE notification_service.notifications"),
        [notificationId, userId]
      );
    });

    it("should throw error if notification not found", async () => {
      (db.query as jest.Mock).mockResolvedValue({ rowCount: 0 });
      
      await expect(markNotificationAsRead(userId, notificationId)).rejects.toThrow(
        "Notification not found"
      );
    });
  });

  describe("markNotificationAsUnread", () => {
    const userId = 123;
    const notificationId = 456;

    it("should mark notification as unread", async () => {
      (db.query as jest.Mock).mockResolvedValue({ rowCount: 1 });
      
      await markNotificationAsUnread(userId, notificationId);
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE notification_service.notifications"),
        [notificationId, userId]
      );
    });

    it("should throw error if notification not found", async () => {
      (db.query as jest.Mock).mockResolvedValue({ rowCount: 0 });
      
      await expect(markNotificationAsUnread(userId, notificationId)).rejects.toThrow(
        "Notification not found"
      );
    });
  });

  describe("deleteNotification", () => {
    const userId = 123;
    const notificationId = 456;

    it("should delete notification", async () => {
      await deleteNotification(userId, notificationId);
      
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM notification_service.notifications"),
        [notificationId, userId]
      );
    });
  });

  describe("sendWelcomeNotification", () => {
    const userId = 123;
    const adminUserId = 1;

    it("should send welcome notification with admin user ID", async () => {
      console.log = jest.fn();
      (callRPC as jest.Mock).mockResolvedValue({ user_id: adminUserId });
      
      await sendWelcomeNotification(userId);
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(`Sending welcome notification to user ${userId}`)
      );
      expect(callRPC).toHaveBeenCalledWith("mock-queue", {});
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO notification_service.notifications"),
        [userId, "WELCOME", "Welcome to Ascend!", JSON.stringify({ user_id: adminUserId })]
      );
    });

    it("should throw error if admin user ID not found", async () => {
      (callRPC as jest.Mock).mockResolvedValue(null);
      
      await expect(sendWelcomeNotification(userId)).rejects.toThrow(
        "Failed to get admin user ID"
      );
    });
  });
});
