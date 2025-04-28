// src/app/__tests__/CopyPostPopup.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CopyPostPopup from "../components/CopyPostPopup";
import { usePostStore } from "../stores/usePostStore";
import { useRouter } from "next/navigation";

// Mock Zustand store
jest.mock("../stores/usePostStore", () => ({
  usePostStore: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CopyPostPopup Component", () => {
  const setCopyPostPopupOpenMock = jest.fn();
  const pushMock = jest.fn();

  beforeEach(() => {
    (usePostStore as unknown as jest.Mock).mockReturnValue({
      copyPostPopupOpen: true,
      setCopyPostPopupOpen: setCopyPostPopupOpenMock,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("renders the success alert message", () => {
    render(<CopyPostPopup />);
    expect(screen.getByText("Link copied to clipboard")).toBeInTheDocument();
  });

  it("calls handleClose when clicking close button", () => {
    render(<CopyPostPopup />);
    const closeButton = screen.getAllByRole("button")[1]; 
    // explanation: 1st button is 'View post' link styled as button (inside alert action)
    // 2nd button is the real close ❌ IconButton
    fireEvent.click(closeButton);
    expect(setCopyPostPopupOpenMock).toHaveBeenCalledWith(false);
  });

  it("navigates to /feed/copypost when clicking 'View post'", () => {
    render(<CopyPostPopup />);
    const viewPostLink = screen.getByText("View post");
    fireEvent.click(viewPostLink);
    expect(setCopyPostPopupOpenMock).toHaveBeenCalledWith(false);
    expect(pushMock).toHaveBeenCalledWith("/feed/copypost");
  });
});
