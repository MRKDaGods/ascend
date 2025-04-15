// __tests__/InputBox.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputBox from "@/app/components/InputBox";
import { useChatStore } from "@/app/stores/chatStore";

jest.mock("@/app/chat/store/chatStore");
const mockUseChatStore = useChatStore as unknown as jest.Mock;

// Provide default mock store
const defaultStore = {
  selectedConversationId: 1,
  messagesByConversation: { 1: [] },
  setMessagesForConversation: jest.fn(),
  typingStatus: {},
  setTypingStatus: jest.fn(),
  appendMessageToConversation: jest.fn(),
};

// Provide mocked getState method
(mockUseChatStore as any).getState = () => defaultStore;

// Mock URL.createObjectURL to avoid crashing when rendering previews
global.URL.createObjectURL = jest.fn(() => "blob:http://localhost/test");

describe("InputBox Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseChatStore.mockImplementation((selector) => selector(defaultStore));
  });

  it("renders input elements", () => {
    render(<InputBox />);
    expect(screen.getByPlaceholderText("Write a message...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("disables send button when no input and no files", () => {
    render(<InputBox />);
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it("enables send button when there is input", () => {
    render(<InputBox />);
    const input = screen.getByPlaceholderText("Write a message...");
    fireEvent.change(input, { target: { value: "Hello" } });
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeEnabled();
  });

  it("clears message on send", async () => {
    render(<InputBox />);
    const input = screen.getByPlaceholderText("Write a message...");
    fireEvent.change(input, { target: { value: "Hello" } });

    const sendButton = screen.getByRole("button", { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Write a message...")).toHaveValue("");
    });
  });

  it("uploads and sends media files", async () => {
    render(<InputBox />);
    const fileInput = screen.getAllByTestId("upload")[0];

    const file = new File(["test"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const sendButton = screen.getByRole("button", { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(defaultStore.appendMessageToConversation).toHaveBeenCalled();
    });
  });

  it("uploads and sends multiple media files", async () => {
    render(<InputBox />);
    const fileInput = screen.getAllByTestId("upload")[0];

    const file1 = new File(["file1"], "file1.png", { type: "image/png" });
    const file2 = new File(["file2"], "file2.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file1, file2] } });

    const sendButton = screen.getByRole("button", { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(defaultStore.appendMessageToConversation).toHaveBeenCalled();
    });
  });

  it("sends both text and media together", async () => {
    render(<InputBox />);
    const input = screen.getByPlaceholderText("Write a message...");
    const fileInput = screen.getAllByTestId("upload")[0];

    const file = new File(["file"], "file.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { value: "Hi with file" } });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const sendButton = screen.getByRole("button", { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(defaultStore.appendMessageToConversation).toHaveBeenCalled();
    });
  });
});
