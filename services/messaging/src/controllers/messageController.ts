import axios from "axios";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import { getSocketServer, getOnlineUsersMap } from "../socket/socketServer";
import { messageValidationRules } from "../validations/messageValidation";
import validate from "@shared/middleware/validationMiddleware";
import {
  sendMessage,
  getUnseenCount,
  getConversations,
  getMessages,
  getOtherUserId,
  validateUserInConversation,
  markMessagesAsRead,
} from "../services/messageService";

/**
 * Handles sending a new message
 * @param {AuthenticatedRequest} req - The authenticated request object
 * @param {Response} res - The response object
 */
export const handleSendMessage = [
  ...messageValidationRules,
  validate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const senderId = req.user!.id;
      const receiverId = parseInt(req.body.receiverId);
      const file = req.file || null;
      const content = req.body.content || null;

      // Check if no receiverId is provided
      if (!receiverId) {
        return res.status(400).json({ error: "Receiver ID is required" });
      }

      // Check that there is a content (text or file)
      if (!content && !file) {
        return res.status(400).json({ error: "Message is empty" });
      }

      const messageResult = await sendMessage(
        senderId,
        receiverId,
        content,
        file
      );

      // Send the message to the receiver via WebSocket
      const receiverSocketId = getOnlineUsersMap().get(receiverId);
      if (receiverSocketId) {
        getSocketServer().to(receiverSocketId).emit("message:receive", {
          senderId,
          conversationId: messageResult.conversationId,
          messageId: messageResult.messageId,
          content: messageResult.content,
          fileUrl: messageResult.fileUrl,
          fileType: messageResult.fileType,
          sentAt: messageResult.sentAt,
        });
      }

      return res.status(200).json({
        conversationId: messageResult.conversationId,
        messageId: messageResult.messageId,
        content: messageResult.content,
        fileUrl: messageResult.fileUrl,
        fileType: messageResult.fileType,
        sentAt: messageResult.sentAt,
      });
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      return res.status(500).json({ error: "Server error" });
    }
  },
];

/**
 * Handles retrieving the count of unseen messages
 * @param {AuthenticatedRequest} req - The authenticated request object
 * @param {Response} res - The response object
 */
export const handleGetUnseenCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const unseenMessageCount = await getUnseenCount(userId);
    return res.status(200).json({ unseenMessageCount });
  } catch (error) {
    console.error("Error in handleUnseenCount:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles retrieving user's conversations
 * @param {AuthenticatedRequest} req - The authenticated request object
 * @param {Response} res - The response object
 */
export const handleGetConversations = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const pageNumber = parseInt(req.query.page as string) || 1;
    const conversationData = await getConversations(userId, pageNumber);
    if (conversationData.data.length === 0) {
      return res.sendStatus(404);
    }
    return res.status(200).json({ conversations: conversationData });
  } catch (error) {
    console.error("Error in handleGetConversations:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Handles retrieving messages for a specific conversation
 * @param {AuthenticatedRequest} req - The authenticated request object
 * @param {Response} res - The response object
 */
export const handleGetMessages = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const conversationId = parseInt(req.params.conversationId);
    const pageNumber = parseInt(req.query.page as string) || 1;

    const isValidUserConversation = await validateUserInConversation(
      conversationId,
      userId
    );

    if (!isValidUserConversation) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const messageData = await getMessages(conversationId, pageNumber);

    const otherUserId = await getOtherUserId(conversationId, userId);
    await markMessagesAsRead(conversationId, otherUserId);

    const otherUserSocketId = getOnlineUsersMap().get(otherUserId);
    if (otherUserSocketId) {
      getSocketServer().to(otherUserSocketId).emit("message:read", {
        conversationId,
      });
    }

    return res.status(200).json({ messages: messageData });
  } catch (error) {
    console.error("Error in handleGetMessages:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const handleGetSocketServerUrl = async (req: Request, res: Response) => {
  try {
    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    const IP = ipResponse.data.ip;

    const PORT = 3011;
    const socketServerUrl = `https://${IP}:${PORT}`;

    return res.status(200).json({ socketServerUrl });
  } catch (error) {
    console.error("Error in handleGetSocketServerUrl:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
