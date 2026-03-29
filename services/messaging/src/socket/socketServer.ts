import { Server } from "socket.io";
import { verifyToken } from "@shared/utils/jwt";
import {
  validateUserInConversation,
  getOtherUserId,
  markMessagesAsRead,
} from "../services/messageService";

// Map to keep track of online users and their socket IDs
// This map will store user IDs as keys and a Set of socket IDs as values
const onlineUsersMap = new Map<number, Set<string>>();

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

      // Initialize Set if this is the first socket for this user
      if (!onlineUsersMap.has(userId)) {
        onlineUsersMap.set(userId, new Set());
      }

      // Add this socket ID to the user's set of sockets
      onlineUsersMap.get(userId)?.add(socket.id);

      socket.data.userId = userId;

      console.log(
        `User ${userId} registered successfully on socket ${socket.id}`
      );
      socket.emit("registered", { userId });
    } catch (error) {
      console.error("Authentication failed:", error);
      socket.emit("error", { message: "Authentication failed" });
    }
  });

  /**
   * Notifies recipient that sender has started typing
   * @param {{ conversationId: number }} data - Conversation ID
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
    const recipientSockets = onlineUsersMap.get(recipientId);

    // Send typing notification to all recipient's connected devices
    if (recipientSockets && recipientSockets.size > 0) {
      recipientSockets.forEach((socketId) => {
        socketServer.to(socketId).emit("typing", {
          conversationId,
        });
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
      const otherUserSockets = onlineUsersMap.get(otherUserId);

      // Notify all of the other user's devices if they are online
      if (otherUserSockets && otherUserSockets.size > 0) {
        otherUserSockets.forEach((socketId) => {
          socketServer.to(socketId).emit("message:read", {
            conversationId,
          });
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
   * Handles client disconnection and removes socket from user's set
   */
  socket.on("disconnect", () => {
    if (socket.data.userId) {
      const userId = socket.data.userId;
      const userSockets = onlineUsersMap.get(userId);

      if (userSockets) {
        // Remove this socket
        userSockets.delete(socket.id);

        // If no more sockets for this user, remove the user entry
        if (userSockets.size === 0) {
          onlineUsersMap.delete(userId);
        }
      }
    }
    console.log(`Client disconnected: ${socket.id}`);
  });
});

/**
 * Gets the Socket.io server instance
 * @returns {Server} The Socket.io server
 */
export const getSocketServer = () => socketServer;

/**
 * Gets the map of online users with their socket IDs
 * @returns {Map<number, Set<string>>} Map of user IDs to sets of socket IDs
 */
export const getOnlineUsersMap = () => onlineUsersMap;

/**
 * Checks if a user is online (has at least one active socket)
 * @param {number} userId - The user ID to check
 * @returns {boolean} True if the user has at least one active connection
 */
export const isUserOnline = (userId: number): boolean => {
  const sockets = onlineUsersMap.get(userId);
  return !!sockets && sockets.size > 0;
};

/**
 * Gets the number of active connections for a user
 * @param {number} userId - The user ID to check
 * @returns {number} The number of active connections
 */
export const getUserConnectionCount = (userId: number): number => {
  const sockets = onlineUsersMap.get(userId);
  return sockets ? sockets.size : 0;
};
