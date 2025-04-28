// __tests__/Message.test.tsx
import { render, screen } from "@testing-library/react";
import Message from "@/app/components/Message";
import { mockUseChatStore } from "../tests/utils/mockUseChatStore";
import { useChatStore } from "@/app/stores/chatStore";

jest.mock("@/app/chat/store/chatStore", () => ({
  useChatStore: jest.fn(),
}));

const mockUseChatStoreTyped = useChatStore as unknown as jest.Mock;

const baseMessage = {
  id: "msg1",
  conversationId: 1,
  content: "Hello there!",
  sender: {
    id: "user1",
    name: "John",
    profilePictureUrl: "https://example.com/john.jpg",
  },
  recipient: {
    id: "user2",
    name: "Ruaa",
    profilePictureUrl: "https://example.com/ruaa.jpg",
  },
  mediaUrls: [],
  createdAt: new Date().toISOString(),
  status: "sent" as const,
};

describe("Message Component", () => {
  beforeEach(() => {
    const mockStore = mockUseChatStore({
      selectedConversationId: 1,
      conversations: [
        {
          id: 1,
          name: "John",
          avatar: "https://example.com/john.jpg",
          userId: "user1",
          isBlockedByPartner: false,
          lastMessage: "",
          unreadCount: 0,
        },
      ],
    });
    mockUseChatStoreTyped.mockImplementation(mockStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders message content", () => {
    render(<Message {...baseMessage} />);
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });

  it("displays sender name and formatted time", () => {
    render(<Message {...baseMessage} />);
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();
  });

  it("displays read receipt symbol when sent by current user", () => {
    const myMessage = {
      ...baseMessage,
      sender: {
        ...baseMessage.sender,
        name: "Ruaa",
      },
      status: "read" as const,
    };
    render(<Message {...myMessage} />);
    expect(screen.getByText("✔️✔️")).toBeInTheDocument();
  });

  it("displays image media", () => {
    const imageMessage = {
      ...baseMessage,
      mediaUrls: ["https://example.com/photo.jpg"],
    };
    render(<Message {...imageMessage} />);
    const images = screen.getAllByRole("img");
    expect(images.find((img) => img.getAttribute("src") === "https://example.com/photo.jpg")).toBeInTheDocument();
  });

  it("displays video media", () => {
    const videoMessage = {
      ...baseMessage,
      mediaUrls: ["https://example.com/video.mp4"],
    };
    render(<Message {...videoMessage} />);
    const video = document.querySelector("video[src='https://example.com/video.mp4']");
    expect(video).toBeInTheDocument();
  });

  it("displays file download link", () => {
    const fileMessage = {
      ...baseMessage,
      mediaUrls: ["https://example.com/document.pdf"],
    };
    render(<Message {...fileMessage} />);
    expect(screen.getByText("📄 Download file")).toBeInTheDocument();
  });

  it("displays 'LinkedIn User' as sender when blocked", () => {
    const mockStore = mockUseChatStore({
      selectedConversationId: 1,
      conversations: [
        {
          id: 1,
          name: "LinkedIn User",
          avatar: "",
          userId: "user1",
          isBlockedByPartner: true,
          lastMessage: "",
          unreadCount: 0,
        },
      ],
    });
    mockUseChatStoreTyped.mockImplementation(mockStore);

    render(<Message {...baseMessage} />);
    expect(screen.getByText("LinkedIn User")).toBeInTheDocument();
  });

  it("renders when content is empty but media exists", () => {
    const imageMessage = {
      ...baseMessage,
      content: "",
      mediaUrls: ["https://example.com/photo.jpg"],
    };
    render(<Message {...imageMessage} />);
    expect(screen.getByRole("img", { name: /john/i })).toBeInTheDocument();
  });

  it("does not crash if no content and no media", () => {
    const emptyMessage = {
      ...baseMessage,
      content: "",
      mediaUrls: [],
    };
    render(<Message {...emptyMessage} />);
    expect(screen.queryByText("Hello there!")).not.toBeInTheDocument();
  });

  it("renders multiple media types together", () => {
    const mediaMessage = {
      ...baseMessage,
      mediaUrls: [
        "https://example.com/photo.jpg",
        "https://example.com/video.mp4",
        "https://example.com/document.pdf",
      ],
    };
    render(<Message {...mediaMessage} />);
    expect(screen.getByText("📄 Download file")).toBeInTheDocument();
    expect(document.querySelector("video[src='https://example.com/video.mp4']")).toBeInTheDocument();
    expect(screen.getAllByRole("img").some(img => img.getAttribute("src") === "https://example.com/photo.jpg")).toBe(true);
  });

 

  it("doesn't crash if selectedConversationId doesn't match", () => {
    const mockStore = mockUseChatStore({
      selectedConversationId: 99,
      conversations: [],
    });
    mockUseChatStoreTyped.mockImplementation(mockStore);
    render(<Message {...baseMessage} />);
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });
});
