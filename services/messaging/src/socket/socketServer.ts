import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { verifyToken } from "@shared/utils/jwt";

// Maps user IDs to their socket IDs for tracking online status
const onlineUsersMap = new Map<number, string>();

// Set up Express and HTTP server
const app = express();
const httpServer = createServer(app);

// Set up Socket.IO with CORS
const socketServer = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const SERVER_PORT = 3011;
httpServer.listen(SERVER_PORT, () => {
  console.log(`Socket server listening on port ${SERVER_PORT}`);
});

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

    const recipientSocketId = onlineUsersMap.get(toUserId);
    if (recipientSocketId) {
      socketServer.to(recipientSocketId).emit("typing:start", {
        fromUserId: socket.data.userId,
      });
    }
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

    const recipientSocketId = onlineUsersMap.get(toUserId);
    if (recipientSocketId) {
      socketServer.to(recipientSocketId).emit("typing:stop", {
        fromUserId: socket.data.userId,
      });
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
