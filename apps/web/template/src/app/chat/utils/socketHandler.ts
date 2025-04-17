import { Message } from "../store/chatStore";
import { io } from "socket.io-client";

export const socket = io(
  "https://fictional-space-orbit-qwwjrw4qg6pcxqx6-3011.app.github.dev/",
  { autoConnect: false }
);

// ✅ SAFE VERSION: No zustand calls inside
export function handleIncomingMessage(
  newMessage: Message,
  selectedConversationId: number | null,
  appendMessageToConversation: (id: number, msg: Message) => void,
  updateLastMessage: (id: number, newMsg: string) => void,
  setUnreadMessagesById: (
    id: number,
    count: number | ((prev: number) => number)
  ) => void
) {
  const conversationId = newMessage.conversationId;
  if (!conversationId) return;

  appendMessageToConversation(conversationId, newMessage);
  updateLastMessage(conversationId, newMessage.content || "[Media]");

  if (selectedConversationId !== conversationId) {
    setUnreadMessagesById(conversationId, (prev) => prev + 1);
  } else {
    // Mark the message as read
    socket.emit("message:read", { conversationId });
  }
}

export function handleIncomingMessageRead(
  conversationId: number,
  setMessagesForConversation: (id: number, msgs: Message[]) => void,
  messagesByConversation: Record<number, Message[]>
) {
  console.log("Message read:", conversationId);

  setMessagesForConversation(
    conversationId,
    messagesByConversation[conversationId]?.map((msg) => ({
      ...msg,
      isRead: true,
      readAt: msg.readAt || new Date(),
    }))
  );
}
