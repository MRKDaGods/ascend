import React from "react";
import { render, screen } from "@testing-library/react";
import DeletePost from "../components/DeletePost"; // Adjust path if needed
import { usePostStore } from "../stores/usePostStore";

// ✅ Mock the Zustand store
jest.mock("../stores/usePostStore", () => ({
  usePostStore: jest.fn(),
}));

describe("DeletePost Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders deleted post message when isLastPostDeleted is true", () => {
    (usePostStore as unknown as jest.Mock).mockReturnValue({
      isLastPostDeleted: true,
    });

    render(<DeletePost />);
    
    // Check that the deleted post message appears
    expect(screen.getByText("Post removed")).toBeInTheDocument();
    expect(screen.getByText("Post successfully deleted.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Post removed/i })).toBeInTheDocument();
  });

  it("does not render anything when isLastPostDeleted is false", () => {
    (usePostStore as unknown as jest.Mock).mockReturnValue({
      isLastPostDeleted: false,
    });

    const { container } = render(<DeletePost />);
    
    // Check that nothing is rendered
    expect(container).toBeEmptyDOMElement();
  });
});
