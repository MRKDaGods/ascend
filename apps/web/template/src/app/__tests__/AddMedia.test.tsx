import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddMedia from "../components/AddMedia";
import { useMediaStore } from "../stores/useMediaStore";
import { usePostStore } from "../stores/usePostStore";

// ✅ Mock Zustand stores
jest.mock("../stores/useMediaStore", () => ({
  useMediaStore: jest.fn(),
}));

jest.mock("../stores/usePostStore", () => ({
  usePostStore: jest.fn(),
}));

describe("AddMedia Component", () => {
  const openEditorMock = jest.fn();
  const setOpenMock = jest.fn();

  beforeEach(() => {
    openEditorMock.mockClear();
    setOpenMock.mockClear();

    (useMediaStore as unknown as jest.Mock).mockReturnValue({
      openEditor: openEditorMock,
      mediaFiles: [], // ✅ mock mediaFiles
      editorOpen: false, // ✅ mock editorOpen to remove Dialog/Modal warnings
    });

    (usePostStore as unknown as jest.Mock).mockReturnValue({
      setOpen: setOpenMock,
    });
  });

  it("renders Photo, Video, and Write Article buttons", () => {
    render(<AddMedia />);
    expect(screen.getByText("Photo")).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText("Write article")).toBeInTheDocument();
  });

  it("calls openEditor('image') when Photo button is clicked", () => {
    render(<AddMedia />);
    fireEvent.click(screen.getByRole("button", { name: /photo/i }));
    expect(openEditorMock).toHaveBeenCalledWith("image");
  });

  it("calls openEditor('video') when Video button is clicked", () => {
    render(<AddMedia />);
    fireEvent.click(screen.getByRole("button", { name: /video/i }));
    expect(openEditorMock).toHaveBeenCalledWith("video");
  });

  it("calls setOpen(true) when Write article button is clicked", () => {
    render(<AddMedia />);
    fireEvent.click(screen.getByRole("button", { name: /write article/i }));
    expect(setOpenMock).toHaveBeenCalledWith(true);
  });
});
