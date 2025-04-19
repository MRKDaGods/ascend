import { Server } from "socket.io";
import { verifyToken } from "@shared/utils/jwt";
import {
  validateUserInConversation,
  getOtherUserId,
  markMessagesAsRead,
} from "../services/messageService";

// Maps user IDs to their socket IDs for tracking online status
const onlineUsersMap = new Map<number, string>();

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
  socket.on("typing", async ({ conversationId }) => {
    if (!socket.data.userId) {
      console.error("User not registered");
      socket.emit("error", { message: "User not registered" });
      return;
    }

    const senderId = socket.data.userId;

    const isValidUser = await validateUserInConversation(
      conversationId,
      senderId
    );

    if (!isValidUser) {
      console.error("User not in conversation");
      socket.emit("error", { message: "User not in conversation" });
      return;
    }

    const recipientId = await getOtherUserId(conversationId, senderId);
    const recipientSocketId = onlineUsersMap.get(recipientId);

    if (recipientSocketId) {
      socketServer.to(recipientSocketId).emit("typing", {
        conversationId,
      });
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
      await markMessagesAsRead(conversationId, otherUserId);
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
