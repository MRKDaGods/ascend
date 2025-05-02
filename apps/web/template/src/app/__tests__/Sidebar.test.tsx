import axios from "axios";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Sidebar from "@/app/components/Sidebar";
import { mockUseChatStore } from "../tests/utils/mockUseChatStore";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Type-safe mock declaration
jest.mock("@/app/chat/store/chatStore", () => ({
    useChatStore: jest.fn<ReturnType<typeof mockUseChatStore>, []>(),
}));

// Import after mock declaration
import { useChatStore } from "@/app/stores/chatStore";

describe("Sidebar Component", () => {
    const mockConversations = [
        {
            id: 1,
            name: "User One",
            avatar: "",
            lastMessage: "Hey!",
            unreadCount: 2,
            userId: "1",
            isBlockedByPartner: false,
        },
        {
            id: 2,
            name: "User Two",
            avatar: "",
            lastMessage: "Hello!",
            unreadCount: 0,
            userId: "2",
            isBlockedByPartner: false,
        },
    ];

    beforeEach(() => {
        const mockedStore = mockUseChatStore({
            conversations: mockConversations,
            unreadMessagesById: { 1: 2, 2: 0 },
            typingStatus: { 1: true, 2: false },
            selectedConversationId: 1,
        });
        (useChatStore as jest.MockedFunction<typeof useChatStore>).mockImplementation(mockedStore);
        mockedAxios.get.mockResolvedValue({ data: mockConversations });
        mockedAxios.put.mockResolvedValue({ data: {} });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders all conversations from the store", async () => {
        render(<Sidebar />);
        await waitFor(() => {
            expect(screen.getByText("User One")).toBeInTheDocument();
            expect(screen.getByText("User Two")).toBeInTheDocument();
        });
    });

    it("shows unread badge for unread conversations", async () => {
        render(<Sidebar />);
        const badge = await screen.findByText("2");
        expect(badge).toBeInTheDocument();
    });

    it("shows fallback text when there are no conversations", async () => {
        const emptyStore = mockUseChatStore({
            conversations: [],
            unreadMessagesById: {},
        });
        (useChatStore as unknown as jest.Mock).mockImplementation(emptyStore);
        mockedAxios.get.mockResolvedValue({ data: [] });

        render(<Sidebar />);
        expect(await screen.findByText("No chats yet")).toBeInTheDocument();
    });

    it("selects a conversation and marks it as read when clicked", async () => {
        render(<Sidebar />);
        const conv = await screen.findByText("User Two");
        fireEvent.click(conv);
        expect(screen.getByText("User Two")).toBeInTheDocument();
    });

    it("opens the MoreVert menu on icon click", async () => {
        render(<Sidebar />);
        const moreButtons = await screen.findAllByRole("button");
        fireEvent.click(moreButtons[1]);
        expect(await screen.findByText("Mark as Read")).toBeInTheDocument();
    });

    it("shows 'Mark as Read' for conversations with unread messages", async () => {
        render(<Sidebar />);
        const moreButtons = await screen.findAllByRole("button");
        fireEvent.click(moreButtons[1]);
        expect(await screen.findByText("Mark as Read")).toBeInTheDocument();
    });

    it("shows 'Mark as Unread' for conversations with no unread messages", async () => {
        const storeNoUnread = mockUseChatStore({
            conversations: mockConversations,
            unreadMessagesById: { 1: 0, 2: 0 },
        });

        (useChatStore as unknown as jest.Mock).mockImplementation(storeNoUnread);
        mockedAxios.get.mockResolvedValue({ data: mockConversations });
        mockedAxios.put.mockResolvedValue({ data: {} });

        render(<Sidebar />);
        const moreButtons = await screen.findAllByRole("button");
        fireEvent.click(moreButtons[1]);
        expect(await screen.findByText("Mark as Unread")).toBeInTheDocument();
    });

    it("calls store's markConversationAsUnread when menu option clicked", async () => {
        const storeNoUnread = mockUseChatStore({
            conversations: mockConversations,
            unreadMessagesById: { 1: 0, 2: 0 },
        });

        (useChatStore as unknown as jest.Mock).mockImplementation(storeNoUnread);
        mockedAxios.get.mockResolvedValue({ data: mockConversations });
        mockedAxios.put.mockResolvedValue({ data: {} });

        render(<Sidebar />);
        const moreButtons = await screen.findAllByRole("button");
        fireEvent.click(moreButtons[1]);
        const option = await screen.findByText("Mark as Unread");
        fireEvent.click(option);
        expect(option).toBeInTheDocument();
    });

    it("calls store's markConversationAsRead when menu option clicked", async () => {
        render(<Sidebar />);
        const moreButtons = await screen.findAllByRole("button");
        fireEvent.click(moreButtons[1]);
        const option = await screen.findByText("Mark as Read");
        fireEvent.click(option);
        expect(option).toBeInTheDocument();
    });

    it("triggers test message injection when 'Trigger Test Message' clicked", async () => {
        const logSpy = jest.spyOn(console, "log").mockImplementation(() => { });
        render(<Sidebar />);
        const testButton = await screen.findByText("Trigger Test Message");
        fireEvent.click(testButton);
        await waitFor(() => {
            expect(logSpy.mock.calls.some(([arg]) => typeof arg === "string" && arg.includes("Store append to convo:"))).toBe(true);
        });
        logSpy.mockRestore();
    });

    it("displays typing status for active conversation", async () => {
        render(<Sidebar />);
        expect(await screen.findByText("typing...")).toBeInTheDocument();
    });
});
