import { render, screen, fireEvent,waitFor } from "@testing-library/react";
import SidebarPreview from "@/app/chat/components/SidebarPreview";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/app/chat/store/chatStore";
import { act } from "react-dom/test-utils";

// Mock the chat store
jest.mock("@/app/chat/store/chatStore", () => ({
  useChatStore: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the Sidebar component
jest.mock("@/app/chat/components/Sidebar", () => {

  return function MockSidebar({ onSelectConversation }: { onSelectConversation: (id: number) => void }) {
    return (
      <div data-testid="mock-sidebar">
        <button onClick={() => onSelectConversation(1)}>Test Conversation</button>
      </div>
    );
  };
});

describe("SidebarPreview Component", () => {
  const mockSetSelectedConversationId = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup store mock
    (useChatStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({
        setSelectedConversationId: mockSetSelectedConversationId,
      });
    });

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders the toggle button initially", () => {
    render(<SidebarPreview />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Chats")).toBeInTheDocument();
  });

  it("opens drawer when toggle button is clicked", () => {
    render(<SidebarPreview />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
  });

  it("calls store and navigates to /chat on conversation select", () => {
    render(<SidebarPreview />);
    
    // Open the drawer
    fireEvent.click(screen.getByRole("button"));
    
    // Click the conversation in the mock sidebar
    fireEvent.click(screen.getByText("Test Conversation"));
    
    expect(mockSetSelectedConversationId).toHaveBeenCalledWith(1);
    expect(mockPush).toHaveBeenCalledWith("/chat");
  });

  it("closes drawer when onClose is triggered", async () => {
    render(<SidebarPreview />);
  
    // Open the drawer
    fireEvent.click(screen.getByRole("button"));
  
    // Confirm drawer is open
    expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();
  
    // Find and click backdrop to trigger onClose
    const backdrop = document.querySelector(".MuiBackdrop-root");
    expect(backdrop).toBeTruthy(); // sanity check
    fireEvent.click(backdrop!); // trigger Drawer onClose
  
    // Wait for the component to reflect closed state
    await waitFor(() => {
      expect(screen.queryByTestId("mock-sidebar")).not.toBeInTheDocument();
    });
  });
  
  
});