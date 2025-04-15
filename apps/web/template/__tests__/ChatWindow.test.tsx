// ChatWindow.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatWindow from "@/app/components/ChatWindow";
import { useChatStore } from "@/app/stores/chatStore";
import axios from "axios";

// Setup scrollIntoView mock
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

// Mocks
jest.mock("axios");
jest.mock("../src/app/chat/store/chatStore");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockUseChatStore = useChatStore as unknown as jest.Mock;

describe("ChatWindow Component", () => {
  const defaultStore = {
    selectedConversationId: 1,
    setMessagesForConversation: jest.fn(),
    conversations: [
      {
        id: 1,
        name: "John Doe",
        avatar: "https://example.com/avatar.jpg",
        userId: "123",
        isBlockedByPartner: false,
      },
    ],
    setSelectedConversationId: jest.fn(),
    setConversations: jest.fn(),
    messagesByConversation: {
      1: [
        {
          id: 1,
          content: "Hello world",
          sender: "John",
          recipient: "Ruaa",
          mediaUrls: [],
          createdAt: new Date().toISOString(),
          conversationId: 1,
          status: "sent",
        },
      ],
    },
    resetPage: jest.fn(),
    page: 1,
    setPage: jest.fn(),
    typingStatus: { 1: false },
    setTypingStatus: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          messages: [
            {
              id: 1,
              content: "Hello world",
              sender: "John",
              recipient: "Ruaa",
              mediaUrls: [],
              createdAt: new Date().toISOString(),
              conversationId: 1,
              status: "sent",
            },
          ],
        },
      },
    });

    (useChatStore as any).getState = () => defaultStore;
  });

  it("renders placeholder when no conversation is selected", () => {
    mockUseChatStore.mockImplementation((selector) =>
      selector({ ...defaultStore, selectedConversationId: null })
    );

    render(<ChatWindow />);
    expect(
      screen.getByText(/select conversation to start chatting/i)
    ).toBeInTheDocument();
  });

  it("renders chat header and message", () => {
    mockUseChatStore.mockImplementation((selector) =>
      selector(defaultStore)
    );

    render(<ChatWindow />);
    expect(screen.getAllByText("John Doe")[0]).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("shows typing indicator when typingStatus is true", () => {
    mockUseChatStore.mockImplementation((selector) =>
      selector({
        ...defaultStore,
        typingStatus: { 1: true },
      })
    );

    render(<ChatWindow />);
    expect(screen.getByText("typing...")).toBeInTheDocument();
  });

  it("renders block message if user is blocked", () => {
    mockUseChatStore.mockImplementation((selector) =>
      selector({
        ...defaultStore,
        conversations: [
          {
            ...defaultStore.conversations[0],
            isBlockedByPartner: true,
          },
        ],
      })
    );

    render(<ChatWindow />);
    expect(
      screen.getByText(/you can no longer message this user/i)
    ).toBeInTheDocument();
  });

  it("calls loadOlderMessages on button click", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { data: { messages: [] } },
    });

    mockUseChatStore.mockImplementation((selector) =>
      selector(defaultStore)
    );

    render(<ChatWindow />);
    const button = screen.getByRole("button", { name: /load older messages/i });
    fireEvent.click(button);

    await waitFor(() =>
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:3001/messages/1?limit=20&page=2"
      )
    );
  });

  it("triggers typing test button and sets typing status", () => {
    const setTypingStatus = jest.fn();

    mockUseChatStore.mockImplementation((selector) =>
      selector({
        ...defaultStore,
        setTypingStatus,
      })
    );

    render(<ChatWindow />);
    const btn = screen.getByText(/trigger typing test/i);
    fireEvent.click(btn);

    expect(setTypingStatus).toHaveBeenCalledWith(1, true);
  });

  it("opens and closes block menu", () => {
    mockUseChatStore.mockImplementation((selector) =>
      selector(defaultStore)
    );

    render(<ChatWindow />);
    const iconBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(iconBtn);

    expect(screen.getByText("Block")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Block"));
  });

  it("handles blocking a user", async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        data: null,
      },
    });

    const setConversations = jest.fn();
    const setSelectedConversationId = jest.fn();

    mockUseChatStore.mockImplementation((selector) =>
      selector({
        ...defaultStore,
        setConversations,
        setSelectedConversationId,
      })
    );

    render(<ChatWindow />);
    const iconBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(iconBtn);
    fireEvent.click(screen.getByText("Block"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:3001/messages/block",
        { userId: "123" }
      );
    });

    await waitFor(() => {
      expect(setConversations).toHaveBeenCalled();
      expect(setSelectedConversationId).toHaveBeenCalledWith(null);
    });
  });
});
