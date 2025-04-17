import { createStore, StoreApi } from "zustand";
import { conversation } from "@/app/chat/components/Sidebar";
import { messageProps } from "@/app/chat/components/MessageItem";

// Define your ChatStore type
type ChatStore = {
  selectedConversationId: number | null;
  setSelectedConversationId: (id: number | null) => void;
  conversations: conversation[];
  setConversations: (c: conversation[] | ((prev: conversation[]) => conversation[])) => void;
  updateLastMessage: (id: number, msg: string) => void;
  messagesByConversation: { [id: number]: messageProps[] };
  setMessagesForConversation: (id: number, msgs: messageProps[] | ((prev: messageProps[]) => messageProps[])) => void;
  appendMessageToConversation: (id: number, msg: messageProps) => void;
  page: number;
  setPage: (p: number) => void;
  resetPage: () => void;
  unreadMessagesById: { [id: number]: number };
  setUnreadMessagesById: (id: number, count: number | ((prev: number) => number)) => void;
  markConversationAsRead: (id: number) => void;
  markConversationAsUnread: (id: number) => void;
  typingStatus: { [id: number]: boolean };
  setTypingStatus: (id: number, isTyping: boolean) => void;
};

// Extend the type to include the zustand store API methods + selector function + mocks
type MockedStore = ((selector?: (state: ChatStore) => any) => any) & {
  getState: StoreApi<ChatStore>["getState"];
  setState: StoreApi<ChatStore>["setState"];
  subscribe: StoreApi<ChatStore>["subscribe"];
  mockReset: () => void;
  mockClear: () => void;
  setSelectedConversationId: jest.Mock;
  appendMessageToConversation: jest.Mock;
};

export const mockUseChatStore = (initialState: Partial<ChatStore> = {}): MockedStore => {
  const actualStore = createStore<ChatStore>(() => ({
    selectedConversationId: null,
    setSelectedConversationId: jest.fn(),
    conversations: [],
    setConversations: jest.fn(),
    updateLastMessage: jest.fn(),
    messagesByConversation: {},
    setMessagesForConversation: jest.fn(),
    appendMessageToConversation: jest.fn(),
    page: 1,
    setPage: jest.fn(),
    resetPage: jest.fn(),
    unreadMessagesById: {},
    setUnreadMessagesById: jest.fn(),
    markConversationAsRead: jest.fn(),
    markConversationAsUnread: jest.fn(),
    typingStatus: {},
    setTypingStatus: jest.fn(),
    ...initialState,
  }));

  const mockSelectorFn = ((selector?: any) => {
    const state = actualStore.getState();
    return selector ? selector(state) : state;
  }) as MockedStore;

  // Attach store API methods
  mockSelectorFn.getState = actualStore.getState;
  mockSelectorFn.setState = actualStore.setState;
  mockSelectorFn.subscribe = actualStore.subscribe;

  // Direct access to frequently used mocks
  mockSelectorFn.setSelectedConversationId = actualStore.getState().setSelectedConversationId as jest.Mock;
  mockSelectorFn.appendMessageToConversation = actualStore.getState().appendMessageToConversation as jest.Mock;

  // Add manual mocks
  mockSelectorFn.mockReset = () => {
    const state = actualStore.getState();
    for (const key in state) {
      const val = (state as any)[key];
      if (jest.isMockFunction(val)) val.mockReset?.();
    }
  };

  mockSelectorFn.mockClear = jest.fn();

  return mockSelectorFn;
};
