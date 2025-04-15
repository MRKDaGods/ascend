import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NewConversationDropdown from "@/app/chat/components/NewConversationDropdown";
import axios from "axios";
import { useChatStore } from "@/app/chat/store/chatStore";
import type { chatStore } from "@/app/chat/store/chatStore";
import userEvent from "@testing-library/user-event";


// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Zustand store
jest.mock("@/app/chat/store/chatStore", () => {
  const actual = jest.requireActual("@/app/chat/store/chatStore");
  return {
    ...actual,
    useChatStore: jest.fn(),
  };
});

const mockedUseChatStore = jest.requireMock("@/app/chat/store/chatStore").useChatStore;

const mockConnections = [
  {
    userId: "1",
    name: "John Doe",
    profilePictureUrl: "http://example.com/john.jpg",
  },
  {
    userId: "2",
    name: "Jane Smith",
    profilePictureUrl: "http://example.com/jane.jpg",
  },
];

const mockAnchorEl = document.createElement("div");

describe("NewConversationDropdown Component", () => {
  const setSelectedConversationId = jest.fn();
  const setConversations = jest.fn();

  const defaultStore: chatStore = {
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
  };
  
  (mockedUseChatStore as any).getState = () => defaultStore;

  beforeEach(() => {
    jest.clearAllMocks();
    

    mockedUseChatStore.mockReturnValue(defaultStore);


    mockedAxios.get.mockResolvedValue({ data: mockConnections });
  });

  it("renders nothing when not open", () => {
    render(<NewConversationDropdown anchorEl={null} onClose={jest.fn()} />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("fetches connections when opened", async () => {
    render(<NewConversationDropdown anchorEl={mockAnchorEl} onClose={jest.fn()} />);
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3001/users/connections");
    });
  });

  it("displays connection list when open", async () => {
    render(<NewConversationDropdown anchorEl={mockAnchorEl} onClose={jest.fn()} />);
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("calls handleStartConversation when a connection is clicked", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { id: "new-conversation-id" } },
    });
  
    render(<NewConversationDropdown anchorEl={mockAnchorEl} onClose={jest.fn()} />);
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  
    const johnDoeItem = screen.getByText("John Doe");
    await userEvent.click(johnDoeItem); // ✅ Replace fireEvent with userEvent
  
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:3001/messages/conversations",
        {
          userId: "1",
          name: "John Doe",
          profilePictureUrl: "http://example.com/john.jpg",
        }
      );
      expect(defaultStore.setConversations).toHaveBeenCalledWith(expect.any(Function));
      expect(defaultStore.setSelectedConversationId).toHaveBeenCalledWith("new-conversation-id");
    });
  });
  

  it("handles API errors gracefully", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Failed to fetch connections"));

    render(<NewConversationDropdown anchorEl={mockAnchorEl} onClose={jest.fn()} />);
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:3001/users/connections");
    });

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("does not create a new conversation if it already exists", async () => {
    defaultStore.conversations = [{ id: 123, userId: "1", lastMessage: "" }] as any;
  
    render(<NewConversationDropdown anchorEl={mockAnchorEl} onClose={jest.fn()} />);
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  
    await userEvent.click(screen.getByText("John Doe"));
  
    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(defaultStore.setSelectedConversationId).toHaveBeenCalledWith(123);
  });
  
  it("closes the menu after starting a conversation", async () => {
    const onClose = jest.fn();
  
    mockedAxios.post.mockResolvedValue({
      data: { data: { id: "new-convo" } },
    });
  
    render(<NewConversationDropdown anchorEl={mockAnchorEl} onClose={onClose} />);
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  
    await userEvent.click(screen.getByText("John Doe"));
  
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
  
});