import { Router } from "express";
import authenticateToken from "@shared/middleware/authMiddleware";
import {
  handleGetConversations,
  handleGetMessages,
  handleSendMessage,
  handleUnseenCount,
} from "../controllers/messageController";

const router = Router();

router.post("/", authenticateToken, handleSendMessage);
router.get("/unseen-count", authenticateToken, handleUnseenCount);
router.get("/conversations", authenticateToken, handleGetConversations);
router.get(
  "/conversations/:conversationId",
  authenticateToken,
  handleGetMessages
);

export default router;
