// Import required modules for testing socket.io functionality
import { Server, Socket as ServerSocket } from "socket.io";
import { io as ioc, Socket as ClientSocket } from "socket.io-client";
// Import JWT utilities for authentication
import * as jwt from "@shared/utils/jwt";
// Import message service functionalities
import * as messageService from "../services/messageService";
// Import socket server functions that we'll be testing
import {
  getSocketServer,
  getOnlineUsersMap,
  isUserOnline,
  getUserConnectionCount,
} from "../socket/socketServer";

// Mock JWT utilities to control authentication behavior in tests
jest.mock("@shared/utils/jwt", () => ({
  verifyToken: jest.fn(),
}));

// Mock message service functions to avoid actual database calls
jest.mock("../services/messageService", () => ({
  validateUserInConversation: jest.fn(),
  getOtherUserId: jest.fn(),
  markMessagesAsRead: jest.fn(),
}));

// Increase Jest timeout to handle asynchronous socket operations
jest.setTimeout(15000);

describe("Socket Server", () => {
  // Declare variables for socket connection and server info
  let clientSocket: ClientSocket;
  let port: number;
  let serverUrl: string;

  // Before all tests, set up server connection details
  beforeAll(() => {
    const server = getSocketServer();
    port = (server.engine as any).port || 3011;
    serverUrl = `http://localhost:${port}`;
  });

  // After all tests, close the server connection
  afterAll((done) => {
    const server = getSocketServer();
    server.close(() => {
      done();
    });
  });

  // Before each test, clear mocks and reset online users map
  beforeEach(() => {
    jest.clearAllMocks();

    // Clear the online users map to start fresh for each test
    const usersMap = getOnlineUsersMap();
    for (const key of usersMap.keys()) {
      usersMap.delete(key);
    }
  });

  // After each test, disconnect any open socket connections
  afterEach((done) => {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
    // Small delay to ensure sockets are properly closed
    setTimeout(() => {
      done();
    }, 50);
  });

  // Helper function to create a client socket with timeout handling
  const createClientSocket = (): Promise<ClientSocket> => {
    return new Promise((resolve) => {
      // Create new socket connection with WebSocket transport
      const socket = ioc(serverUrl, {
        transports: ["websocket"],
        autoConnect: true,
        forceNew: true,
      });

      // Set timeout to handle connection issues
      const timeout = setTimeout(() => {
        console.error("Socket connection timeout");
        socket.close();
        resolve(socket);
      }, 3000);

      // Resolve promise when connected successfully
      socket.on("connect", () => {
        clearTimeout(timeout);
        resolve(socket);
      });

      // Handle connection errors
      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        clearTimeout(timeout);
        resolve(socket);
      });
    });
  };

  // Test group for connection and user registration functionality
  describe("Connection and Registration", () => {
    // Test that new client connections are logged
    test("should connect a client and log new connection", async () => {
      // Spy on console.log to verify logging
      const consoleSpy = jest.spyOn(console, "log");

      clientSocket = await createClientSocket();

      // Verify the connection was logged
      expect(consoleSpy).toHaveBeenCalledWith("New client connected");

      consoleSpy.mockRestore();
    });

    // Test user registration with valid JWT token
    test("should register a user with valid token", async () => {
      const userId = 123;
      // Mock JWT verification to return valid user ID
      (jwt.verifyToken as jest.Mock).mockReturnValue({ id: userId });
      const consoleSpy = jest.spyOn(console, "log");

      clientSocket = await createClientSocket();

      // Create promise to handle asynchronous registration event
      const registrationPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Registration timeout"));
        }, 3000);

        // Listen for successful registration response
        clientSocket.on("registered", (data) => {
          clearTimeout(timeout);
          expect(data).toEqual({ userId });
          resolve();
        });

        // Emit registration event with token
        clientSocket.emit("register", "valid-token");
      });

      await registrationPromise;

      // Verify user is marked as online
      expect(isUserOnline(userId)).toBe(true);
      expect(getUserConnectionCount(userId)).toBe(1);

      // Verify successful registration was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`User ${userId} registered successfully`)
      );

      consoleSpy.mockRestore();
    });

    // Test error handling for invalid tokens
    test("should handle invalid token during registration", async () => {
      // Mock JWT verification to throw error for invalid token
      (jwt.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });
      const consoleSpy = jest.spyOn(console, "error");

      clientSocket = await createClientSocket();

      // Create promise to handle asynchronous error event
      const errorPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Error event timeout"));
        }, 3000);

        // Listen for error response
        clientSocket.on("error", (data) => {
          clearTimeout(timeout);
          expect(data).toEqual({ message: "Authentication failed" });
          resolve();
        });

        // Emit registration with invalid token
        clientSocket.emit("register", "invalid-token");
      });

      await errorPromise;

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        "Authentication failed:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    // Test handling multiple connections from the same user
    test("should handle multiple sockets for the same user", async () => {
      const userId = 123;
      // Mock JWT verification to return valid user ID
      (jwt.verifyToken as jest.Mock).mockReturnValue({ id: userId });

      clientSocket = await createClientSocket();

      // Register first socket
      const registrationPromise1 = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("First registration timeout"));
        }, 3000);

        clientSocket.on("registered", () => {
          clearTimeout(timeout);
          resolve();
        });

        clientSocket.emit("register", "valid-token");
      });

      await registrationPromise1;

      // Create second socket for same user
      const clientSocket2 = await createClientSocket();

      // Register second socket
      const registrationPromise2 = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Second registration timeout"));
        }, 3000);

        clientSocket2.on("registered", () => {
          clearTimeout(timeout);
          resolve();
        });

        clientSocket2.emit("register", "valid-token");
      });

      await registrationPromise2;

      // Verify user has two connections
      expect(getUserConnectionCount(userId)).toBe(2);

      clientSocket2.disconnect();
    });

    // Test socket cleanup on disconnection
    test("should remove socket on disconnect", async () => {
      const userId = 123;
      // Mock JWT verification to return valid user ID
      (jwt.verifyToken as jest.Mock).mockReturnValue({ id: userId });
      const consoleSpy = jest.spyOn(console, "log");

      clientSocket = await createClientSocket();

      // Register user
      const registrationPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Registration timeout"));
        }, 3000);

        clientSocket.on("registered", () => {
          clearTimeout(timeout);
          resolve();
        });

        clientSocket.emit("register", "valid-token");
      });

      await registrationPromise;

      expect(getUserConnectionCount(userId)).toBe(1);

      // Disconnect socket and wait for cleanup
      const disconnectPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);

        clientSocket.disconnect();
      });

      await disconnectPromise;

      // Verify user is no longer online
      expect(isUserOnline(userId)).toBe(false);

      // Verify disconnection was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Client disconnected:")
      );

      consoleSpy.mockRestore();
    });
  });

  // Test group for typing notification functionality
  describe("Typing Notifications", () => {
    // Test emitting typing notification to conversation partner
    test("should emit typing notification to recipient", async () => {
      const senderId = 123;
      const recipientId = 456;
      const conversationId = 789;

      // Mock service functions to allow valid typing notification
      (
        messageService.validateUserInConversation as jest.Mock
      ).mockResolvedValue(true);
      (messageService.getOtherUserId as jest.Mock).mockResolvedValue(
        recipientId
      );

      // Setup sender socket
      (jwt.verifyToken as jest.Mock).mockReturnValue({ id: senderId });
      clientSocket = await createClientSocket();

      // Register sender
      const registrationPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Sender registration timeout"));
        }, 3000);

        clientSocket.on("registered", () => {
          clearTimeout(timeout);
          resolve();
        });

        clientSocket.emit("register", "valid-token");
      });

      await registrationPromise;

      // Setup recipient socket
      const recipientSocket = await createClientSocket();
      const recipientRegistrationPromise = new Promise<void>(
        (resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Recipient registration timeout"));
          }, 3000);

          recipientSocket.on("registered", () => {
            clearTimeout(timeout);
            resolve();
          });
        }
      );

      // Register recipient
      (jwt.verifyToken as jest.Mock).mockReturnValue({ id: recipientId });
      recipientSocket.emit("register", "valid-token");
      await recipientRegistrationPromise;

      // Setup promise to catch typing notification on recipient side
      const typingPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Typing event timeout"));
        }, 3000);

        recipientSocket.on("typing", (data) => {
          clearTimeout(timeout);
          expect(data).toEqual({ conversationId });
          resolve();
        });
      });

      // Emit typing event from sender
      clientSocket.emit("typing", { conversationId });

      await typingPromise;

      // Verify service functions were called correctly
      expect(messageService.validateUserInConversation).toHaveBeenCalledWith(
        conversationId,
        senderId
      );
      expect(messageService.getOtherUserId).toHaveBeenCalledWith(
        conversationId,
        senderId
      );

      recipientSocket.disconnect();
    });

    // Test error handling for unregistered users
    test("should not emit typing notification for unregistered user", async () => {
      const conversationId = 789;
      const consoleSpy = jest.spyOn(console, "error");

      clientSocket = await createClientSocket();

      // Setup promise to catch error response
      const errorPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Error event timeout"));
        }, 3000);

        clientSocket.on("error", (data) => {
          clearTimeout(timeout);
          expect(data).toEqual({ message: "User not registered" });
          resolve();
        });

        // Emit typing without registration
        clientSocket.emit("typing", { conversationId });
      });

      await errorPromise;

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith("User not registered");

      // Verify service functions weren't called
      expect(messageService.validateUserInConversation).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    // Test error handling for users not in conversation
    test("should not emit typing notification if user not in conversation", async () => {
      const userId = 123;
      const conversationId = 789;
      const consoleSpy = jest.spyOn(console, "error");

      // Mock validation to return false (user not in conversation)
      (
        messageService.validateUserInConversation as jest.Mock
      ).mockResolvedValue(false);

      // Register user
      (jwt.verifyToken as jest.Mock).mockReturnValue({ id: userId });
      clientSocket = await createClientSocket();

      const registrationPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Registration timeout"));
        }, 3000);

        clientSocket.on("registered", () => {
          clearTimeout(timeout);
          resolve();
        });

        clientSocket.emit("register", "valid-token");
      });

      await registrationPromise;

      // Setup promise to catch error response
      const errorPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Error event timeout"));
        }, 3000);

        clientSocket.on("error", (data) => {
          clearTimeout(timeout);
          expect(data).toEqual({ message: "User not in conversation" });
          resolve();
        });

        // Emit typing for conversation user isn't part of
        clientSocket.emit("typing", { conversationId });
      });

      await errorPromise;

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith("User not in conversation");

      // Verify validation was called but not other services
      expect(messageService.validateUserInConversation).toHaveBeenCalledWith(
        conversationId,
        userId
      );

      expect(messageService.getOtherUserId).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  // Test group for message read notification functionality
  describe("Message Read Notifications", () => {
    // Test marking messages as read and notifying sender
    test("should mark messages as read and notify recipient", async () => {
      const senderId = 123;
      const recipientId = 456;
      const conversationId = 789;

      // Mock service functions for successful read notification
      (
        messageService.validateUserInConversation as jest.Mock
      ).mockResolvedValue(true);
      (messageService.getOtherUserId as jest.Mock).mockResolvedValue(
        recipientId
      );
      (messageService.markMessagesAsRead as jest.Mock).mockResolvedValue(
        undefined
      );

      // Setup sender socket
      (jwt.verifyToken as jest.Mock).mockReturnValue({ id: senderId });
      clientSocket = await createClientSocket();

      const registrationPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Sender registration timeout"));
        }, 3000);

        clientSocket.on("registered", () => {
          clearTimeout(timeout);
          resolve();
        });

        clientSocket.emit("register", "valid-token");
      });

      await registrationPromise;

      // Setup recipient socket
      const recipientSocket = await createClientSocket();
      const recipientRegistrationPromise = new Promise<void>(
        (resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Recipient registration timeout"));
          }, 3000);

          recipientSocket.on("registered", () => {
            clearTimeout(timeout);
            resolve();
          });
        }
      );

      (jwt.verifyToken as jest.Mock).mockReturnValue({ id: recipientId });
      recipientSocket.emit("register", "valid-token");
      await recipientRegistrationPromise;

      // Setup promise to catch read notification on recipient side
      const readPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Read event timeout"));
        }, 3000);

        recipientSocket.on("message:read", (data) => {
          clearTimeout(timeout);
          expect(data).toEqual({ conversationId });
          resolve();
        });
      });

      // Emit read event from sender
      clientSocket.emit("message:read", { conversationId });

      await readPromise;

      // Verify service functions were called correctly
      expect(messageService.validateUserInConversation).toHaveBeenCalledWith(
        conversationId,
        senderId
      );
      expect(messageService.getOtherUserId).toHaveBeenCalledWith(
        conversationId,
        senderId
      );
      expect(messageService.markMessagesAsRead).toHaveBeenCalledWith(
        conversationId,
        recipientId
      );

      recipientSocket.disconnect();
    });

    // Test error handling during read notification
    test("should handle error during read notification", async () => {
      const userId = 123;
      const conversationId = 789;
      const consoleSpy = jest.spyOn(console, "error");

      // Mock validation to throw error
      (
        messageService.validateUserInConversation as jest.Mock
      ).mockRejectedValue(new Error("Database error"));

      // Register user
      (jwt.verifyToken as jest.Mock).mockReturnValue({ id: userId });
      clientSocket = await createClientSocket();

      const registrationPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Registration timeout"));
        }, 3000);

        clientSocket.on("registered", () => {
          clearTimeout(timeout);
          resolve();
        });

        clientSocket.emit("register", "valid-token");
      });

      await registrationPromise;

      // Setup promise to catch error response
      const errorPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Error event timeout"));
        }, 3000);

        clientSocket.on("error", (data) => {
          clearTimeout(timeout);
          expect(data).toEqual({ message: "Failed to mark messages as read" });
          resolve();
        });

        // Emit read event that will trigger error
        clientSocket.emit("message:read", { conversationId });
      });

      await errorPromise;

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error handling message:read event:",
        expect.any(Error)
      );

      // Verify only validation was called
      expect(messageService.validateUserInConversation).toHaveBeenCalledWith(
        conversationId,
        userId
      );

      expect(messageService.getOtherUserId).not.toHaveBeenCalled();
      expect(messageService.markMessagesAsRead).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    // Test error handling for unregistered users
    test("should handle unregistered user for message:read event", async () => {
      const conversationId = 789;
      const consoleSpy = jest.spyOn(console, "error");

      clientSocket = await createClientSocket();

      // Setup promise to catch error response
      const errorPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Error event timeout"));
        }, 3000);

        clientSocket.on("error", (data) => {
          clearTimeout(timeout);
          expect(data).toEqual({ message: "User not registered" });
          resolve();
        });

        // Emit read event without registration
        clientSocket.emit("message:read", { conversationId });
      });

      await errorPromise;

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith("User not registered");

      // Verify no service functions were called
      expect(messageService.validateUserInConversation).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    // Test error handling for users not in conversation
    test("should handle user not in conversation for message:read event", async () => {
      const userId = 123;
      const conversationId = 789;
      const consoleSpy = jest.spyOn(console, "error");

      // Mock validation to return false (user not in conversation)
      (
        messageService.validateUserInConversation as jest.Mock
      ).mockResolvedValue(false);

      // Register user
      (jwt.verifyToken as jest.Mock).mockReturnValue({ id: userId });
      clientSocket = await createClientSocket();

      const registrationPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Registration timeout"));
        }, 3000);

        clientSocket.on("registered", () => {
          clearTimeout(timeout);
          resolve();
        });

        clientSocket.emit("register", "valid-token");
      });

      await registrationPromise;

      // Setup promise to catch error response
      const errorPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Error event timeout"));
        }, 3000);

        clientSocket.on("error", (data) => {
          clearTimeout(timeout);
          expect(data).toEqual({ message: "User not in conversation" });
          resolve();
        });

        // Emit read event for conversation user isn't part of
        clientSocket.emit("message:read", { conversationId });
      });

      await errorPromise;

      // Verify error was logged
      expect(consoleSpy).toHaveBeenCalledWith("User not in conversation");

      // Verify only validation was called
      expect(messageService.validateUserInConversation).toHaveBeenCalledWith(
        conversationId,
        userId
      );

      expect(messageService.getOtherUserId).not.toHaveBeenCalled();
      expect(messageService.markMessagesAsRead).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  // Test group for utility functions
  describe("Utility Functions", () => {
    // Test getSocketServer function
    test("getSocketServer should return the socket server instance", () => {
      const server = getSocketServer();
      expect(server).toBeInstanceOf(Server);
    });

    // Test getOnlineUsersMap function
    test("getOnlineUsersMap should return the map of online users", () => {
      const map = getOnlineUsersMap();
      expect(map).toBeInstanceOf(Map);
    });

    // Test isUserOnline function for online users
    test("isUserOnline should return true for online users", () => {
      const userId = 123;
      const userMap = getOnlineUsersMap();
      userMap.set(userId, new Set(["socket-id"]));

      expect(isUserOnline(userId)).toBe(true);
    });

    // Test isUserOnline function for offline users
    test("isUserOnline should return false for offline users", () => {
      expect(isUserOnline(999)).toBe(false);
    });

    // Test getUserConnectionCount function for connected users
    test("getUserConnectionCount should return correct count for users", () => {
      const userId = 123;
      const userMap = getOnlineUsersMap();
      userMap.set(userId, new Set(["socket-1", "socket-2", "socket-3"]));

      expect(getUserConnectionCount(userId)).toBe(3);
    });

    // Test getUserConnectionCount function for offline users
    test("getUserConnectionCount should return 0 for offline users", () => {
      expect(getUserConnectionCount(999)).toBe(0);
    });
  });

  // Test direct message sending to online recipient
  test("should notify sender when message is sent via socket", async () => {
    const senderId = 123;
    const recipientId = 456;
    const conversationId = 789;

    // Create and setup sockets for sender and recipient
    const senderSocket = await createClientSocket();
    const recipientSocket = await createClientSocket();

    // Register sender
    (jwt.verifyToken as jest.Mock).mockReturnValue({ id: senderId });
    const senderRegistrationPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Sender registration timeout"));
      }, 3000);

      senderSocket.on("registered", () => {
        clearTimeout(timeout);
        resolve();
      });
    });
    senderSocket.emit("register", "valid-token");
    await senderRegistrationPromise;

    // Register recipient
    (jwt.verifyToken as jest.Mock).mockReturnValue({ id: recipientId });
    const recipientRegistrationPromise = new Promise<void>(
      (resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Recipient registration timeout"));
        }, 3000);

        recipientSocket.on("registered", () => {
          clearTimeout(timeout);
          resolve();
        });
      }
    );
    recipientSocket.emit("register", "valid-token");
    await recipientRegistrationPromise;

    // Create test message object
    const message = {
      id: 999,
      conversationId,
      senderId,
      content: "Test message",
      createdAt: new Date().toISOString(),
    };

    // Setup promise to verify message receipt
    const messageReceivePromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Message receive timeout"));
      }, 3000);

      recipientSocket.on("message:receive", (data) => {
        clearTimeout(timeout);
        // Verify received message matches sent message
        expect(data.message).toEqual(
          expect.objectContaining({
            id: message.id,
            conversationId: message.conversationId,
            senderId: message.senderId,
            content: message.content,
          })
        );
        resolve();
      });
    });

    // Get socket server and emit message directly to recipient's socket
    const server = getSocketServer();
    const recipientSocketIds = getOnlineUsersMap().get(recipientId);

    if (recipientSocketIds) {
      for (const socketId of recipientSocketIds) {
        server.to(socketId).emit("message:receive", { message });
      }
    }

    await messageReceivePromise;

    // Clean up sockets
    senderSocket.disconnect();
    recipientSocket.disconnect();
  });
});
