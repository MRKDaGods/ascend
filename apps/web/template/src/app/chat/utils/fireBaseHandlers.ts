import { messageProps } from "../../components/Message";

// ✅ SAFE VERSION: No zustand calls inside
export function handleIncomingMessage(
    newMessage: messageProps,
    selectedConversationId: number | null,
    appendMessageToConversation: (id: number, msg: messageProps) => void,
    updateLastMessage: (id: number, newMsg: string) => void,
    setUnreadMessagesById: (id: number, count: number | ((prev: number) => number)) => void
  ) {
    const conversationId = newMessage.conversationId;
    if (!conversationId) return;
  
    appendMessageToConversation(conversationId, newMessage);
    updateLastMessage(conversationId, newMessage.content || "[Media]");
  
    if (selectedConversationId !== conversationId) {
      setUnreadMessagesById(conversationId, (prev) => prev + 1);
    }
  }
  