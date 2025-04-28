import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DiscardRepostDialog from "../components/DiscardRepostDialog"; // adjust path if needed

describe("DiscardRepostDialog Component", () => {
  const onCloseMock = jest.fn();
  const onDiscardMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog content correctly when open", () => {
    render(<DiscardRepostDialog open={true} onClose={onCloseMock} onDiscard={onDiscardMock} />);

    expect(screen.getByText("Discard draft")).toBeInTheDocument();
    expect(
      screen.getByText(
        /You haven’t finished your post yet. Are you sure you want to leave and discard your draft/i
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
  });

  it("calls onClose when clicking Go back button", () => {
    render(<DiscardRepostDialog open={true} onClose={onCloseMock} onDiscard={onDiscardMock} />);

    fireEvent.click(screen.getByRole("button", { name: "Go back" }));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(onDiscardMock).not.toHaveBeenCalled();
  });

  it("calls onDiscard when clicking Discard button", () => {
    render(<DiscardRepostDialog open={true} onClose={onCloseMock} onDiscard={onDiscardMock} />);

    fireEvent.click(screen.getByRole("button", { name: "Discard" }));

    expect(onDiscardMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("does not render anything when open is false", () => {
    const { container } = render(<DiscardRepostDialog open={false} onClose={onCloseMock} onDiscard={onDiscardMock} />);
    expect(container).toBeEmptyDOMElement();
  });
});
