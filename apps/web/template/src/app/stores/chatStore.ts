import { Profile } from "@ascend/api-client/models";
import { create } from "zustand";

export interface Conversation {
  conversationId: number;
  otherUserId: number;
  otherUserFullName: string;
  otherUserProfilePictureUrl?: string;
  isBlocked: false;
  lastMessageContent?: string;
  lastMessageTimestamp: Date;
  unseenMessageCount: number;
}

export interface Message {
  messageId: number;
  senderId: number;
  content?: string;
  fileUrl?: string;
  fileType?: string;
  sentAt: Date;
  readAt?: Date;
  isRead: boolean;

  conversationId?: number;
}

//should include all global states related to chat

//defining the whole state (el state 3ala baadaha gowaha selectedid w conversations w msgs)
type chatStore = {
  selectedConversationId: number | null;
  setSelectedConversationId: (id: number | null) => void;
  conversations: Conversation[];
  setConversations: (
    convos: Conversation[] | ((prev: Conversation[]) => Conversation[])
  ) => void;
  updateLastMessage: (conversationId: number, newLastMessage: string) => void;
  messagesByConversation: { [conversationId: number]: Message[] };
  setMessagesForConversation: (
    id: number,
    msgs: Message[] | ((prev: Message[]) => Message[])
  ) => void;
  appendMessageToConversation: (id: number, msg: Message) => void; //for convenience bas el ablaha is enough to append
  page: number;
  setPage: (newPage: number) => void;
  resetPage: () => void;
  unreadMessagesById: { [conversationId: number]: number };
  setUnreadMessagesById: (
    id: number,
    unreadcount: number | ((prev: number) => number)
  ) => void;
  setAllUnreadMessagesById: (unreadCounts: {
    [conversationId: number]: number;
  }) => void;
  markConversationAsRead: (id: number) => void;
  markConversationAsUnread: (id: number) => void;
  typingStatus: { [conversationId: number]: boolean };
  setTypingStatus: (id: number, isTyping: boolean) => void;

  localUser: Profile | null;
  setLocalUser: (user: Profile | null) => void;

  // Flag to refresh conversations
  refreshConvos: boolean;
  newConvoId: number | null;
  forceRefreshConvos: (convoId: number) => void;

  //handleIncomingMessage?: (msg: Message) => void;
};

export type { chatStore };

//actual store el lama ba call useChateStore byraga3ly the state object passed to set
//ana lama ba setWTV i update the state object bel object el b3taha l set
export const useChatStore = create<chatStore>((set) => ({
  selectedConversationId: null,
  setSelectedConversationId: (id) => set({ selectedConversationId: id }),
  conversations: [],
  setConversations: (convosOrFn) =>
    typeof convosOrFn === "function"
      ? set((state) => ({ conversations: convosOrFn(state.conversations) }))
      : set({ conversations: convosOrFn }),
  updateLastMessage: (conversationId, newLastMessage) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.conversationId === conversationId
          ? {
              ...conv,
              lastMessageContent: newLastMessage,
              lastMessageTimestamp: new Date(),
            }
          : conv
      ),
    })),
  messagesByConversation: {},
  //set new message list or update one
  setMessagesForConversation: (id, msgs) =>
    typeof msgs === "function"
      ? set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [id]: msgs(state.messagesByConversation[id] || []),
          },
        }))
      : set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [id]: msgs,
          },
        })),
  //update a new message list
  appendMessageToConversation: (id, msg) => {
    if (id == null) return {};
    console.log("Store append to convo:", id, msg.content);
    return set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [id]: [...(state.messagesByConversation[id] || []), msg],
      },

      // When a new message is added, move this conversation to the top
      conversations: state.conversations
        .map((convo) =>
          convo.conversationId === id
            ? { ...convo, lastMessageTimestamp: new Date() }
            : convo
        )
        .sort(
          (a, b) =>
            new Date(b.lastMessageTimestamp).getTime() -
            new Date(a.lastMessageTimestamp).getTime()
        ),
    }));
  },
  page: 1,
  setPage: (newPage) => set({ page: newPage }),
  resetPage: () => set({ page: 1 }),
  unreadMessagesById: {},
  setUnreadMessagesById: (id, newCount) =>
    typeof newCount === "function"
      ? set((state) => ({
          unreadMessagesById: {
            ...state.unreadMessagesById,
            [id]: newCount(state.unreadMessagesById[id] || 0),
          },
        }))
      : set((state) => ({
          unreadMessagesById: { ...state.unreadMessagesById, [id]: newCount },
        })),
  setAllUnreadMessagesById: (unreadCounts) =>
    set({ unreadMessagesById: unreadCounts }),
  markConversationAsRead: (id) =>
    set((state) => ({
      unreadMessagesById: {
        ...state.unreadMessagesById,
        [id]: 0,
      },
    })),
  markConversationAsUnread: (id) =>
    set((state) => ({
      unreadMessagesById: {
        ...state.unreadMessagesById,
        [id]: 1,
      },
    })),
  typingStatus: {},
  setTypingStatus: (id, isTyping) =>
    set((state) => ({
      typingStatus: {
        ...state.typingStatus,
        [id]: isTyping,
      },
    })),

  localUser: null,
  setLocalUser: (user) => set({ localUser: user }),

  refreshConvos: false,
  newConvoId: null,
  forceRefreshConvos: (convoId) =>
    set(() => ({
      refreshConvos: true,
      newConvoId: convoId,
    })),
}));
