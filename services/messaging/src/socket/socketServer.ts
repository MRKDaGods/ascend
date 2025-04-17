import { Server } from "socket.io";
import { verifyToken } from "@shared/utils/jwt";
import {
  validateUserInConversation,
  getOtherUserId,
  markMessagesAsRead,
} from "../services/messageService";

// Maps user IDs to their socket IDs for tracking online status
const onlineUsersMap = new Map<number, string>();

// Map to track typing timeouts for each sender and recipient
const typingTimeouts = new Map<number, Map<number, NodeJS.Timeout>>();

const socketServer = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const SERVER_PORT = 3011;
socketServer.listen(SERVER_PORT);

console.log(`Socket server listening on port ${SERVER_PORT}`);

/**
 * Handles socket connections and events
 */
socketServer.on("connection", (socket) => {
  console.log("New client connected");

  /**
   * Registers a user with their authentication token
   * @param {string} authToken - JWT token for user authentication
   */
  socket.on("register", async (authToken: string) => {
    try {
      const tokenPayload = verifyToken(authToken);
      const userId = tokenPayload.id;

      onlineUsersMap.set(userId, socket.id);
      socket.data.userId = userId;

      console.log(`User ${userId} registered successfully`);
      socket.emit("registered", { userId });
    } catch (error) {
      console.error("Authentication failed:", error);
      socket.emit("error", { message: "Authentication failed" });
    }
  });

  /**
   * Notifies recipient that sender has started typing
   * @param {{ toUserId: number }} data - Recipient's user ID
   */
  socket.on("typing:start", ({ toUserId }) => {
    if (!socket.data.userId) {
      console.error("User not registered");
      socket.emit("error", { message: "User not registered" });
      return;
    }

    const senderId = socket.data.userId;
    const recipientSocketId = onlineUsersMap.get(toUserId);

    if (recipientSocketId) {
      socketServer.to(recipientSocketId).emit("typing:start", {
        fromUserId: senderId,
      });
    }

    // Initialize or retrieve the sender's timeout map
    if (!typingTimeouts.has(senderId)) {
      typingTimeouts.set(senderId, new Map());
    }
    const senderTimeouts = typingTimeouts.get(senderId)!;

    // Clear any existing timeout for this recipient
    if (senderTimeouts.has(toUserId)) {
      clearTimeout(senderTimeouts.get(toUserId)!);
    }

    // Set a timeout to send "typing:stop" after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      if (recipientSocketId) {
        socketServer.to(recipientSocketId).emit("typing:stop", {
          fromUserId: senderId,
        });
      }
      senderTimeouts.delete(toUserId);
      if (senderTimeouts.size === 0) {
        typingTimeouts.delete(senderId);
      }
    }, 2000);

    senderTimeouts.set(toUserId, timeout);
  });

  /**
   * Notifies recipient that sender has stopped typing
   * @param {{ toUserId: number }} data - Recipient's user ID
   */
  socket.on("typing:stop", ({ toUserId }) => {
    if (!socket.data.userId) {
      console.error("User not registered");
      socket.emit("error", { message: "User not registered" });
      return;
    }

    const senderId = socket.data.userId;
    const recipientSocketId = onlineUsersMap.get(toUserId);

    if (recipientSocketId) {
      socketServer.to(recipientSocketId).emit("typing:stop", {
        fromUserId: senderId,
      });
    }

    // Clear the timeout for this recipient
    if (typingTimeouts.has(senderId)) {
      const senderTimeouts = typingTimeouts.get(senderId)!;
      if (senderTimeouts.has(toUserId)) {
        clearTimeout(senderTimeouts.get(toUserId)!);
        senderTimeouts.delete(toUserId);
      }
      if (senderTimeouts.size === 0) {
        typingTimeouts.delete(senderId);
      }
    }
  });

  socket.on("message:read", async ({ conversationId }) => {
    if (!socket.data.userId) {
      console.error("User not registered");
      socket.emit("error", { message: "User not registered" });
      return;
    }

    const senderId = socket.data.userId;

    try {
      // Validate if the user is part of the conversation
      const isValidUser = await validateUserInConversation(
        conversationId,
        senderId
      );
      if (!isValidUser) {
        console.error("User not in conversation");
        socket.emit("error", { message: "User not in conversation" });
        return;
      }

      // Get the other user's ID
      const otherUserId = await getOtherUserId(conversationId, senderId);
      const otherUserSocketId = onlineUsersMap.get(otherUserId);

      // Notify the other user if they are online
      if (otherUserSocketId) {
        socketServer.to(otherUserSocketId).emit("message:read", {
          conversationId,
        });
      }

      // Mark messages as read
      await markMessagesAsRead(conversationId, senderId);
    } catch (error) {
      console.error("Error handling message:read event:", error);
      socket.emit("error", { message: "Failed to mark messages as read" });
    }
  });

  /**
   * Handles client disconnection and removes user from online list
   */
  socket.on("disconnect", () => {
    if (socket.data.userId) {
      onlineUsersMap.delete(socket.data.userId);
    }
    console.log("Client disconnected");
  });
});

/**
 * Gets the Socket.io server instance
 * @returns {Server} The Socket.io server
 */
export const getSocketServer = () => socketServer;

/**
 * Gets the map of online users
 * @returns {Map<number, string>} Map of user IDs to socket IDs
 */
export const getOnlineUsersMap = () => onlineUsersMap;
