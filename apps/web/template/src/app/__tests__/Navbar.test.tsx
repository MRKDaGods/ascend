// src/app/__tests__/Navbar.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { useThemeStore } from "../stores/useThemeStore";
import { useMenuStore } from "../stores/useMenuStore";
import { useNotificationStore } from "../stores/useNotificationStore";
import { useProfileStore } from "../stores/useProfileStore";
import { useRouter, usePathname } from "next/navigation";

// Mock zustand stores
jest.mock("../stores/useThemeStore", () => ({
  useThemeStore: jest.fn(),
}));

jest.mock("../stores/useMenuStore", () => ({
  useMenuStore: jest.fn(),
}));

jest.mock("../stores/useNotificationStore", () => ({
  useNotificationStore: jest.fn(),
}));

jest.mock("../stores/useProfileStore", () => ({
  useProfileStore: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe("Navbar Component", () => {
  const toggleThemeMock = jest.fn();
  const setAnchorElMock = jest.fn();
  const closeMenuMock = jest.fn();
  const pushMock = jest.fn();

  beforeEach(() => {
    (useThemeStore as unknown as jest.Mock).mockReturnValue({
      theme: "light",
      toggleTheme: toggleThemeMock,
    });

    (useMenuStore as unknown as jest.Mock).mockReturnValue({
      anchorEl: null,
      setAnchorEl: setAnchorElMock,
      closeMenu: closeMenuMock,
    });

    (useNotificationStore as unknown as jest.Mock).mockReturnValue({
      notifications: [],
    });

    (useProfileStore as unknown as jest.Mock).mockReturnValue({
      userData: {
        first_name: "John",
        last_name: "Doe",
        profile_picture_url: "/avatar.png",
      },
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    (usePathname as jest.Mock).mockReturnValue("/feed");
  });

  it("renders logo and search bar", () => {
    render(<Navbar />);
    expect(screen.getByText("Ascend")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search for jobs, people...")).toBeInTheDocument();
  });

  it("renders nav icons using aria-label", () => {
    render(<Navbar />);
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "My Network" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Jobs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Messaging" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
  });

  it("toggles theme when clicking theme button", () => {
    render(<Navbar />);
    const themeButton = screen.getByRole("button", { name: /switch to dark mode/i });
    fireEvent.click(themeButton);
    expect(toggleThemeMock).toHaveBeenCalled();
  });

  it("opens profile menu when avatar is clicked", () => {
    render(<Navbar />);
    const allButtons = screen.getAllByRole("button");
    const avatarButton = allButtons.find(button =>
      button.querySelector("img[alt='undefined undefined']")
    );
    if (avatarButton) {
      fireEvent.click(avatarButton);
      expect(setAnchorElMock).toHaveBeenCalled();
    } else {
      throw new Error("Avatar button not found");
    }
  });

  it("navigates to feed page when logo is clicked", () => {
    render(<Navbar />);
    const logo = screen.getByText("Ascend");
    fireEvent.click(logo);
    expect(pushMock).toHaveBeenCalledWith("/feed");
  });
});
