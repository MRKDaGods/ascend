import { Router } from "express";
import authenticateToken from "@shared/middleware/authMiddleware";
import {
  handleGetConversations,
  handleGetMessages,
  handleSendMessage,
  handleGetUnseenCount,
} from "../controllers/messageController";

const messageRouter = Router();

messageRouter.post("/", authenticateToken, handleSendMessage);
messageRouter.get("/unseen-count", authenticateToken, handleGetUnseenCount);
messageRouter.get("/conversations", authenticateToken, handleGetConversations);
messageRouter.get(
  "/conversations/:conversationId",
  authenticateToken,
  handleGetMessages
);

export default messageRouter;
