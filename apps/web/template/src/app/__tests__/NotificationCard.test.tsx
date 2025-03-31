import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotificationCard from "../components/NotificationCard";
import { useNotificationStore } from "../store/useNotificationStore";
import { act } from "react";
import { useRouter } from "next/navigation";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: pushMock,
    replace: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    isFallback: false,
  })),
}));

jest.mock("../store/useNotificationStore", () => ({
  useNotificationStore: jest.fn(),
}));

describe("NotificationCard Component", () => {
  let mockStore: {
    notifications: {
      id: string;
      message: string;
      timestamp: string;
      type: string;
      link: string;
      profilePhoto: string;
      markedasread: boolean;
      seen: boolean;
    }[];
    markAsRead: (id: string) => void;
    markAsUnread: jest.Mock;
    deleteNotification: jest.Mock;
    hydrated: boolean;
    setHydrated: jest.Mock;
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    mockStore = {
      notifications: [
        {
          id: "1",
          message: "New notification",
          timestamp: "2025-03-26",
          type: "mention",
          link: "/profile",
          profilePhoto: "https://via.placeholder.com/40",
          markedasread: false,
          seen: false,
        },
      ],
      markAsRead: jest.fn((id) => {
        mockStore.notifications = mockStore.notifications.map((notif) =>
          notif.id === id ? { ...notif, markedasread: true } : notif
        );
      }),
      markAsUnread: jest.fn(),
      deleteNotification: jest.fn(),
      hydrated: true,
      setHydrated: jest.fn(),
    };

    (useNotificationStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  it("renders the notification message", () => {
    render(<NotificationCard />);
    expect(screen.getByText("New notification")).toBeInTheDocument();
  });

  it("calls markAsRead and router.push when clicking a notification", () => {
    render(<NotificationCard />);
    const notificationItem = screen.getByText("New notification");

    act(() => {
      fireEvent.click(notificationItem);
    });

    expect(mockStore.markAsRead).toHaveBeenCalledWith("1");
    expect(pushMock).toHaveBeenCalledWith("/profile");
  });
});