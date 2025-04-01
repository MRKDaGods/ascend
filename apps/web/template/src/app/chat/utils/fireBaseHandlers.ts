import { useChatStore } from "../store/chatStore";
import { messageProps } from "../components/Message";


export function handleIncomingMessage(newMessage: messageProps){
    const {
        selectedConversationId,
        setUnreadMessagesById,
        appendMessageToConversation,
        updateLastMessage
    } = useChatStore.getState();

    const conversationId = newMessage.conversationId;
    if (!conversationId) return;
    appendMessageToConversation(conversationId, newMessage);
    updateLastMessage(conversationId,newMessage.content || "[Media]");

    if (selectedConversationId !==conversationId){
        setUnreadMessagesById(conversationId, (prev) => prev + 1);

    }

}


