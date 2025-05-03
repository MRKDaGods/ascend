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

// Define a custom file interface instead of relying on Express.Multer.File
interface MockFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
}

type TestRequest = Partial<Omit<AuthenticatedRequest, "file">> & {
  file?: MockFile | null;
  user?: { id: number };
  body?: any;
  params?: any;
  query?: any;
};

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

jest.mock("../socket/socketServer", () => ({
  getSocketServer: jest.fn(),
  getOnlineUsersMap: jest.fn(),
}));

jest.mock("@shared/middleware/validationMiddleware", () => jest.fn());
jest.mock("../validations/messageValidation", () => ({
  messageValidationRules: [],
}));

describe("Message Controller", () => {
  let mockRequest: TestRequest;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;
  let responseSendStatus: jest.Mock;
  let mockSocketEmit: jest.Mock;
  let mockSocketTo: jest.Mock;
  let mockOnlineUsers: Map<number, string>;

  // FIX: Extract the handler function correctly
  // This needs to be a function, not a variable
  const sendMessageHandler = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    // Call the real handler function, which is the last item in the handleSendMessage array
    return (handleSendMessage[handleSendMessage.length - 1] as any)(req, res);
  };

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    responseSendStatus = jest.fn().mockReturnThis();

    mockRequest = {
      query: {},
      params: {},
      body: {},
      user: { id: 1 },
      file: null,
    };

    mockResponse = {
      json: responseJson,
      status: responseStatus,
      sendStatus: responseSendStatus,
    };

    mockSocketEmit = jest.fn();
    mockSocketTo = jest.fn().mockReturnValue({ emit: mockSocketEmit });
    mockOnlineUsers = new Map();

    (socketServer.getSocketServer as jest.Mock).mockReturnValue({
      to: mockSocketTo,
    });

    (socketServer.getOnlineUsersMap as jest.Mock).mockReturnValue(
      mockOnlineUsers
    );

    jest.clearAllMocks();
  });

  describe("handleSendMessage", () => {
    it("should send a message successfully", async () => {
      mockRequest.body = {
        receiverId: "2",
        content: "Hello there!",
      };

      (messageService.canSendMessage as jest.Mock).mockResolvedValue(true);
      (messageService.isMessageLimitReached as jest.Mock).mockResolvedValue(
        false
      );
      (messageService.sendMessage as jest.Mock).mockResolvedValue({
        conversationId: 1,
        messageId: 10,
        content: "Hello there!",
        fileUrl: null,
        fileType: null,
        sentAt: new Date(),
      });

      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

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

    it("should emit message to online recipient via WebSocket", async () => {
      mockRequest.body = {
        receiverId: "2",
        content: "Hi!",
      };

      const messageResult = {
        conversationId: 1,
        messageId: 11,
        content: "Hi!",
        fileUrl: null,
        fileType: null,
        sentAt: new Date(),
      };

      mockOnlineUsers.set(2, "socket-abc");

      (messageService.canSendMessage as jest.Mock).mockResolvedValue(true);
      (messageService.isMessageLimitReached as jest.Mock).mockResolvedValue(
        false
      );
      (messageService.sendMessage as jest.Mock).mockResolvedValue(
        messageResult
      );

      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockSocketTo).toHaveBeenCalledWith("socket-abc");
      expect(mockSocketEmit).toHaveBeenCalledWith(
        "message:receive",
        expect.objectContaining({
          senderId: 1,
          conversationId: 1,
          messageId: 11,
        })
      );
    });

    it("should send message with a file", async () => {
      mockRequest.body = { receiverId: "2" };
      mockRequest.file = {
        fieldname: "file",
        originalname: "test.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        buffer: Buffer.from("abc"),
        size: 3,
      };

      (messageService.canSendMessage as jest.Mock).mockResolvedValue(true);
      (messageService.isMessageLimitReached as jest.Mock).mockResolvedValue(
        false
      );
      (messageService.sendMessage as jest.Mock).mockResolvedValue({
        conversationId: 1,
        messageId: 22,
        content: null,
        fileUrl: "https://cdn.test.com/test.jpg",
        fileType: "image/jpeg",
        sentAt: new Date(),
      });

      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(messageService.sendMessage).toHaveBeenCalledWith(
        1,
        2,
        null,
        mockRequest.file
      );
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(
        expect.objectContaining({
          fileUrl: "https://cdn.test.com/test.jpg",
          fileType: "image/jpeg",
        })
      );
    });

    it("should reject missing receiverId", async () => {
      mockRequest.body = { content: "No receiver!" };

      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Receiver ID is required",
      });
    });

    it("should reject empty message", async () => {
      mockRequest.body = { receiverId: "2" };

      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: "Message is empty" });
    });

    it("should reject when not allowed to send", async () => {
      mockRequest.body = { receiverId: "2", content: "Nope" };
      (messageService.canSendMessage as jest.Mock).mockResolvedValue(false);

      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Cannot send message",
      });
    });

    it("should reject when limit reached", async () => {
      mockRequest.body = { receiverId: "2", content: "Limit" };
      (messageService.canSendMessage as jest.Mock).mockResolvedValue(true);
      (messageService.isMessageLimitReached as jest.Mock).mockResolvedValue(
        true
      );

      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({
        error: "Message limit reached",
      });
    });

    it("should handle server error", async () => {
      mockRequest.body = { receiverId: "2", content: "Error" };
      (messageService.canSendMessage as jest.Mock).mockRejectedValue(
        new Error("Boom")
      );

      await sendMessageHandler(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetUnseenCount", () => {
    it("should return unseen count", async () => {
      (messageService.getUnseenCount as jest.Mock).mockResolvedValue(5);

      await handleGetUnseenCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ unseenMessageCount: 5 });
    });

    it("should handle error", async () => {
      (messageService.getUnseenCount as jest.Mock).mockRejectedValue(
        new Error("Err")
      );

      await handleGetUnseenCount(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetConversations", () => {
    it("should return conversations", async () => {
      const mockConvos = {
        data: [{ id: 1, lastMessage: "Hello" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };
      mockRequest.query = { page: "1" };
      (messageService.getConversations as jest.Mock).mockResolvedValue(
        mockConvos
      );

      await handleGetConversations(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ conversations: mockConvos });
    });

    it("should return 404 if no conversations", async () => {
      (messageService.getConversations as jest.Mock).mockResolvedValue({
        data: [],
        pagination: { total: 0, page: 1, limit: 10 },
      });

      await handleGetConversations(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseSendStatus).toHaveBeenCalledWith(404);
    });

    it("should handle error", async () => {
      (messageService.getConversations as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      await handleGetConversations(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("handleGetMessages", () => {
    it("should return messages and mark as read", async () => {
      const mockMessages = {
        data: [{ id: 1, content: "Yo" }],
        pagination: { total: 1, page: 1, limit: 10 },
      };

      mockRequest.params = { conversationId: "1" };
      mockRequest.query = { page: "1" };

      (
        messageService.validateUserInConversation as jest.Mock
      ).mockResolvedValue(true);
      (messageService.getMessages as jest.Mock).mockResolvedValue(mockMessages);
      (messageService.getOtherUserId as jest.Mock).mockResolvedValue(2);
      (messageService.markMessagesAsRead as jest.Mock).mockResolvedValue(
        undefined
      );

      await handleGetMessages(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ messages: mockMessages });
    });

    it("should notify the other user when marking as read", async () => {
      mockRequest.params = { conversationId: "1" };
      mockOnlineUsers.set(2, "socket-xyz");

      (
        messageService.validateUserInConversation as jest.Mock
      ).mockResolvedValue(true);
      (messageService.getMessages as jest.Mock).mockResolvedValue({
        data: [],
        pagination: {},
      });
      (messageService.getOtherUserId as jest.Mock).mockResolvedValue(2);

      await handleGetMessages(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockSocketTo).toHaveBeenCalledWith("socket-xyz");
      expect(mockSocketEmit).toHaveBeenCalledWith("message:read", {
        conversationId: 1,
      });
    });

    it("should return 403 if user is not in conversation", async () => {
      mockRequest.params = { conversationId: "1" };
      (
        messageService.validateUserInConversation as jest.Mock
      ).mockResolvedValue(false);

      await handleGetMessages(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(403);
      expect(responseJson).toHaveBeenCalledWith({ error: "Forbidden" });
    });

    it("should handle server error", async () => {
      mockRequest.params = { conversationId: "1" };
      (
        messageService.validateUserInConversation as jest.Mock
      ).mockRejectedValue(new Error("Fail"));

      await handleGetMessages(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });
});
