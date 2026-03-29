// Import necessary types and dependencies
import { Response } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import * as messageService from "../services/messageService";
import * as socketServer from "../socket/socketServer";
import {
  handleSendMessage,
  handleGetUnseenCount,
  handleGetConversations,
  handleGetMessages,
} from "../controllers/messageController";

/**
 * Interface representing a file upload for testing purposes
 * Mimics the structure of multer file objects
 */
interface MockFile {
  fieldname: string; // Field name in the form
  originalname: string; // Original file name
  encoding: string; // File encoding
  mimetype: string; // MIME type
  buffer: Buffer; // File contents
  size: number; // File size in bytes
  destination?: string; // Upload destination
  filename?: string; // Name of saved file
  path?: string; // Path where file was saved
}

/**
 * Custom request type for testing that extends AuthenticatedRequest
 * Includes optional properties for simulating different request scenarios
 */
type TestRequest = Partial<Omit<AuthenticatedRequest, "file">> & {
  file?: MockFile | null; // Optional file upload
  user?: { id: number }; // Authenticated user info
  body?: any; // Request body
  params?: any; // URL parameters
  query?: any; // Query parameters
};

// Mock the message service module to avoid actual service calls during tests
jest.mock("../services/messageService", () => ({
  sendMessage: jest.fn(),
  getUnseenCount: jest.fn(),
  getConversations: jest.fn(),
  getMessages: jest.fn(),
  getOtherUserId: jest.fn(),
  validateUserInConversation: jest.fn(),
  markMessagesAsRead: jest.fn(),
  canSendMessage: jest.fn(),
  isMessageLimitReached: jest.fn(),
}));

// Mock the socket server module to test WebSocket notifications
jest.mock("../socket/socketServer", () => {
  // Create mock functions for socket operations
  const mockEmit = jest.fn();
  const mockTo = jest.fn().mockReturnValue({ emit: mockEmit });

  return {
    // Mock socket server functions
    getSocketServer: jest.fn().mockReturnValue({
      to: mockTo,
      emit: jest.fn(),
    }),
    getOnlineUsersMap: jest.fn().mockReturnValue(new Map()),
    isUserOnline: jest.fn().mockReturnValue(false),
    getUserConnectionCount: jest.fn().mockReturnValue(0),
    // Expose mock functions for test assertions
    __mockTo: mockTo,
    __mockEmit: mockEmit,
  };
});

// Mock validation middleware and rules
jest.mock("@shared/middleware/validationMiddleware", () => jest.fn());
jest.mock("../validations/messageValidation", () => ({
  messageValidationRules: [],
}));

// Main test suite for the Message Controller
describe("Message Controller", () => {
  // Declare test variables used across multiple tests
  let mockRequest: TestRequest;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let responseSendStatus: jest.Mock;

  /**
   * Helper function to call the actual send message handler
   * This is needed because handleSendMessage might be an array of middleware
   */
  const sendMessageHandler = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    return (handleSendMessage[handleSendMessage.length - 1] as any)(req, res);
  };

  // Reset mocks and set up fresh test doubles before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock response methods with chaining support
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    responseSendStatus = jest.fn().mockReturnThis();

    // Set up a default mock request object
    mockRequest = {
      query: {},
      params: {},
      body: {},
      user: { id: 1 },
      file: null,
    };

    // Set up a mock response object with common methods
    mockResponse = {
      json: responseJson,
      status: responseStatus,
      sendStatus: responseSendStatus,
    };

    // Reset socket server mocks
    const mockEmit = (socketServer as any).__mockEmit;
    const mockTo = (socketServer as any).__mockTo;
    mockTo.mockReturnValue({ emit: mockEmit });

    // Set up mock online users for WebSocket tests
    const mockOnlineUsersMap = new Map();
    mockOnlineUsersMap.set(2, new Set(["socket-abc"]));
    mockOnlineUsersMap.set(3, new Set(["socket-xyz"]));

    // Configure socket mocks to return prepared test data
    (socketServer.getOnlineUsersMap as jest.Mock).mockReturnValue(
      mockOnlineUsersMap
    );
    (socketServer.isUserOnline as jest.Mock).mockImplementation((userId) => {
      return mockOnlineUsersMap.has(userId);
    });
  });

  // Tests for the handleSendMessage controller
  describe("handleSendMessage", () => {
    // Test for successful message sending
    it("should send a message successfully", async () => {
      // Setup request with basic text message
      mockRequest.body = {
        receiverId: "2",
        content: "Hello there!",
      };

      // Configure mocks to allow message sending
      (messageService.canSendMessage as jest.Mock).mockResolvedValue(true);
      (messageService.isMessageLimitReached as jest.Mock).mockResolvedValue(
        false
      );
      // Mock successful message creation
      (messageService.sendMessage as jest.Mock).mockResolvedValue({
        conversationId: 1,
        messageId: 10,
        content: "Hello there!",
        fileUrl: null,
        fileType: null,
        sentAt: new Date(),
      });

      // Call the handler
      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify response
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          conversationId: 1,
          messageId: 10,
          content: "Hello there!",
          sentAt: expect.any(Date),
        })
      );
    });

    // Test WebSocket notification to online recipients
    it("should emit message to online recipient via WebSocket", async () => {
      // Get references to socket mock functions
      const mockTo = (socketServer as any).__mockTo;
      const mockEmit = (socketServer as any).__mockEmit;

      // Set up message request
      mockRequest.body = {
        receiverId: "2",
        content: "Hi!",
      };

      // Prepare mock message result
      const messageResult = {
        conversationId: 1,
        messageId: 11,
        content: "Hi!",
        fileUrl: null,
        fileType: null,
        sentAt: new Date(),
      };

      // Configure mocks to allow message sending
      (messageService.canSendMessage as jest.Mock).mockResolvedValue(true);
      (messageService.isMessageLimitReached as jest.Mock).mockResolvedValue(
        false
      );
      (messageService.sendMessage as jest.Mock).mockResolvedValue(
        messageResult
      );

      // Call the handler
      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify WebSocket notification was sent to the right recipient
      expect(mockTo).toHaveBeenCalledWith("socket-abc");
      expect(mockEmit).toHaveBeenCalledWith(
        "message:receive",
        expect.objectContaining({
          senderId: 1,
          conversationId: 1,
          messageId: 11,
        })
      );
    });

    // Test file attachment handling
    it("should send message with a file", async () => {
      // Set up request with file but no text content
      mockRequest.body = { receiverId: "2" };
      mockRequest.file = {
        fieldname: "file",
        originalname: "test.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        buffer: Buffer.from("abc"),
        size: 3,
      };

      // Configure mocks to allow message sending
      (messageService.canSendMessage as jest.Mock).mockResolvedValue(true);
      (messageService.isMessageLimitReached as jest.Mock).mockResolvedValue(
        false
      );
      // Mock successful file message creation
      (messageService.sendMessage as jest.Mock).mockResolvedValue({
        conversationId: 1,
        messageId: 22,
        content: null,
        fileUrl: "https://cdn.test.com/test.jpg",
        fileType: "image/jpeg",
        sentAt: new Date(),
      });

      // Call the handler
      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify service was called with file data
      expect(messageService.sendMessage).toHaveBeenCalledWith(
        1,
        2,
        null,
        mockRequest.file
      );
      // Verify response includes file information
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          fileUrl: "https://cdn.test.com/test.jpg",
          fileType: "image/jpeg",
        })
      );
    });

    // Test validation for missing recipient
    it("should reject missing receiverId", async () => {
      // Set up request with missing receiver
      mockRequest.body = { content: "No receiver!" };

      // Call the handler
      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify proper error response
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Receiver ID is required",
      });
    });

    // Test validation for empty message
    it("should reject empty message", async () => {
      // Set up request with no content and no file
      mockRequest.body = { receiverId: "2" };

      // Call the handler
      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify proper error response
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: "Message is empty" });
    });

    // Test permission check
    it("should reject when not allowed to send", async () => {
      // Set up valid request data
      mockRequest.body = { receiverId: "2", content: "Nope" };
      // But configure permission check to fail
      (messageService.canSendMessage as jest.Mock).mockResolvedValue(false);

      // Call the handler
      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify permission error response
      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Cannot send message",
      });
    });

    // Test message limit enforcement
    it("should reject when limit reached", async () => {
      // Set up valid request data
      mockRequest.body = { receiverId: "2", content: "Limit" };
      // Configure permission check to pass but limit check to fail
      (messageService.canSendMessage as jest.Mock).mockResolvedValue(true);
      (messageService.isMessageLimitReached as jest.Mock).mockResolvedValue(
        true
      );

      // Call the handler
      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify limit error response
      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Message limit reached",
      });
    });

    // Test error handling
    it("should handle server error", async () => {
      // Set up valid request data
      mockRequest.body = { receiverId: "2", content: "Error" };
      // But make the service throw an error
      (messageService.canSendMessage as jest.Mock).mockRejectedValue(
        new Error("Boom")
      );

      // Call the handler
      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify server error response
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for the handleGetUnseenCount controller
  describe("handleGetUnseenCount", () => {
    // Test successful retrieval of unseen count
    it("should return unseen count", async () => {
      // Mock service to return 5 unseen messages
      (messageService.getUnseenCount as jest.Mock).mockResolvedValue(5);

      // Call the handler
      await handleGetUnseenCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify response
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ unseenMessageCount: 5 });
    });

    // Test error handling
    it("should handle error", async () => {
      // Make service throw an error
      (messageService.getUnseenCount as jest.Mock).mockRejectedValue(
        new Error("Err")
      );

      // Call the handler
      await handleGetUnseenCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify server error response
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for the handleGetConversations controller
  describe("handleGetConversations", () => {
    // Test successful retrieval of conversations
    it("should return conversations", async () => {
      // Prepare mock conversation data
      const mockConvos = {
        data: [{ id: 1, lastMessage: "Hello" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };
      // Configure request with pagination
      mockRequest.query = { page: "1" };
      // Mock service to return test data
      (messageService.getConversations as jest.Mock).mockResolvedValue(
        mockConvos
      );

      // Call the handler
      await handleGetConversations(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify response
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ conversations: mockConvos });
    });

    // Test when no conversations are found
    it("should return 404 if no conversations", async () => {
      // Mock service to return empty data
      (messageService.getConversations as jest.Mock).mockResolvedValue({
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      });

      // Call the handler
      await handleGetConversations(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify 404 response
      expect(responseSendStatus).toHaveBeenCalledWith(404);
    });

    // Test error handling
    it("should handle error", async () => {
      // Make service throw an error
      (messageService.getConversations as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      // Call the handler
      await handleGetConversations(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify server error response
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Tests for the handleGetMessages controller
  describe("handleGetMessages", () => {
    // Test successful retrieval and marking messages as read
    it("should return messages and mark as read", async () => {
      // Prepare mock message data
      const mockMessages = {
        data: [{ id: 1, content: "Yo" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };

      // Configure request with conversation ID and pagination
      mockRequest.params = { conversationId: "1" };
      mockRequest.query = { page: "1" };

      // Configure mocks for successful flow
      (
        messageService.validateUserInConversation as jest.Mock
      ).mockResolvedValue(true);
      (messageService.getMessages as jest.Mock).mockResolvedValue(mockMessages);
      (messageService.getOtherUserId as jest.Mock).mockResolvedValue(2);
      (messageService.markMessagesAsRead as jest.Mock).mockResolvedValue(
        undefined
      );

      // Call the handler
      await handleGetMessages(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify response
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ messages: mockMessages });
    });

    // Test WebSocket notification for read messages
    it("should notify the other user when marking as read", async () => {
      // Get references to socket mock functions
      const mockTo = (socketServer as any).__mockTo;
      const mockEmit = (socketServer as any).__mockEmit;

      // Configure request with conversation ID
      mockRequest.params = { conversationId: "1" };

      // Configure mocks for successful flow
      (
        messageService.validateUserInConversation as jest.Mock
      ).mockResolvedValue(true);
      (messageService.getMessages as jest.Mock).mockResolvedValue({
        data: [],
        pagination: {},
      });
      // Set user ID 3 as the other participant
      (messageService.getOtherUserId as jest.Mock).mockResolvedValue(3);

      // Call the handler
      await handleGetMessages(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify WebSocket notification was sent to right recipient
      expect(mockTo).toHaveBeenCalledWith("socket-xyz");
      expect(mockEmit).toHaveBeenCalledWith("message:read", {
        conversationId: 1,
      });
    });

    // Test permission validation
    it("should return 403 if user is not in conversation", async () => {
      // Configure request with conversation ID
      mockRequest.params = { conversationId: "1" };
      // But make validation fail
      (
        messageService.validateUserInConversation as jest.Mock
      ).mockResolvedValue(false);

      // Call the handler
      await handleGetMessages(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify forbidden response
      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({ error: "Forbidden" });
    });

    // Test error handling
    it("should handle server error", async () => {
      // Configure request with conversation ID
      mockRequest.params = { conversationId: "1" };
      // But make validation throw an error
      (
        messageService.validateUserInConversation as jest.Mock
      ).mockRejectedValue(new Error("Fail"));

      // Call the handler
      await handleGetMessages(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      // Verify server error response
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });
});
