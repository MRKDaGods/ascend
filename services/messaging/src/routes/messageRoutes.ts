import { Router } from "express";
import authenticateToken from "@shared/middleware/authMiddleware";
import {
  handleGetConversations,
  handleGetMessages,
  handleSendMessage,
  handleGetUnseenCount,
} from "../controllers/messageController";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const messageRouter = Router();

messageRouter.get("/unseen-count", authenticateToken, handleGetUnseenCount);
messageRouter.get("/conversations", authenticateToken, handleGetConversations);
messageRouter.post("/", authenticateToken, upload.single("file"), handleSendMessage);
messageRouter.get("/conversations/:conversationId", authenticateToken, handleGetMessages);

export default messageRouter;
