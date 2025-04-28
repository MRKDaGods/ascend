// src/app/__tests__/CreatePost.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreatePost from "../components/CreatePost";

// Create a mock function for setOpen
const setOpenMock = jest.fn();

// Mock Zustand stores
jest.mock("../stores/usePostStore", () => ({
  usePostStore: () => ({
    open: false,
    setOpen: setOpenMock,
    draftText: "",
  }),
}));

jest.mock("../stores/useProfileStore", () => ({
  useProfileStore: () => ({
    first_name: "John",
    last_name: "Doe",
    profile_picture_url: "https://example.com/avatar.png",
  }),
}));

// Mock child components
jest.mock("../components/AddMedia", () => () => <div data-testid="add-media" />);
jest.mock("../components/UserPostPopup", () => () => <div data-testid="user-post-popup" />);
jest.mock("../components/CreatePostDialog", () => () => <div data-testid="create-post-dialog" />);
jest.mock("../components/DraftSavedPopup", () => () => <div data-testid="draft-saved-popup" />);
jest.mock("../components/RepostPopup", () => () => <div data-testid="repost-popup" />);

describe("CreatePost component", () => {
  beforeEach(() => {
    setOpenMock.mockClear(); // ✅ Clear mock calls before each test
  });

  it("renders user's avatar with full name", () => {
    render(<CreatePost />);
    const avatar = screen.getByAltText("John Doe");
    expect(avatar).toBeInTheDocument();
  });

  it("renders 'Start a post' text", () => {
    render(<CreatePost />);
    const startPostButton = screen.getByText("Start a post");
    expect(startPostButton).toBeInTheDocument();
  });

  it("renders AddMedia component", () => {
    render(<CreatePost />);
    const addMedia = screen.getByTestId("add-media");
    expect(addMedia).toBeInTheDocument();
  });

  it("calls setOpen when clicking start a post box", () => {
    render(<CreatePost />);
    const startPostBox =
      screen.getByRole("button", { hidden: true }) ||
      screen.getByText("Start a post");
    fireEvent.click(startPostBox);
    expect(setOpenMock).toHaveBeenCalledWith(true);
  });
});
