import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DeletePostDialog from "../components/DeletePostDialog"; // adjust if needed
import { usePostStore } from "../stores/usePostStore";

// ✅ Mock the Zustand store
jest.mock("../stores/usePostStore", () => ({
  usePostStore: jest.fn(),
}));

describe("DeletePostDialog Component", () => {
  const deletePostFromAPIMock = jest.fn();
  const setLastPostDeletedMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (usePostStore as unknown as jest.Mock).mockReturnValue({
      deletePostFromAPI: deletePostFromAPIMock,
      setLastPostDeleted: setLastPostDeletedMock,
    });
  });

  it("renders dialog content correctly when open", () => {
    render(<DeletePostDialog open={true} postId={123} onClose={onCloseMock} />);

    expect(screen.getByText("Delete post?")).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to permanently remove this post/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onClose when clicking Cancel", () => {
    render(<DeletePostDialog open={true} postId={123} onClose={onCloseMock} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(deletePostFromAPIMock).not.toHaveBeenCalled();
    expect(setLastPostDeletedMock).not.toHaveBeenCalled();
  });

  it("calls deletePostFromAPI, setLastPostDeleted, and onClose when clicking Delete", () => {
    render(<DeletePostDialog open={true} postId={456} onClose={onCloseMock} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(deletePostFromAPIMock).toHaveBeenCalledWith(456);
    expect(setLastPostDeletedMock).toHaveBeenCalledWith(true);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("does not render dialog content when open is false", () => {
    const { container } = render(<DeletePostDialog open={false} postId={789} onClose={onCloseMock} />);
    expect(container).toBeEmptyDOMElement();
  });
});
