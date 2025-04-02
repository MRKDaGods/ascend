import { Request, Response } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import {
  sendMessage,
  getUnseenCount,
  getConversations,
  getMessages,
} from "../services/messageService";

export const handleSendMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { receiverId, content, hasFiles } = req.body;
    const senderId = req.user!.id;
    const result = await sendMessage(senderId, receiverId, content, hasFiles);
    if (!result) {
      return res.status(400).json({ error: "Failed to send message" });
    }
    return res.sendStatus(200);
  } catch (error) {
    console.error("Error in handleSendMessage:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const handleUnseenCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const unseenCount = await getUnseenCount(userId);
    return res.status(200).json({ unseenCount });
  } catch (error) {
    console.error("Error in handleUnseenCount:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const handleGetConversations = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const conversations = await getConversations(userId, page);
    if (conversations.data.length === 0) {
      return res.sendStatus(404);
    }
    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error in handleGetConversations:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const handleGetMessages = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const messages = await getMessages(conversationId, userId, page);
    if (messages.data.length === 0) {
      return res.sendStatus(404);
    }
    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error in handleGetConversation:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
