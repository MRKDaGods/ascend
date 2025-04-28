import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DiscardMediaDialog from "../components/DiscardMediaDialog"; // adjust if needed

describe("DiscardMediaDialog Component", () => {
  const onCloseMock = jest.fn();
  const onDiscardMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog content correctly when open", () => {
    render(<DiscardMediaDialog open={true} onClose={onCloseMock} onDiscard={onDiscardMock} />);

    expect(screen.getByText("Discard changes")).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to discard the changes/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
  });

  it("calls onClose when clicking Cancel", () => {
    render(<DiscardMediaDialog open={true} onClose={onCloseMock} onDiscard={onDiscardMock} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(onDiscardMock).not.toHaveBeenCalled();
  });

  it("calls onDiscard when clicking Discard", () => {
    render(<DiscardMediaDialog open={true} onClose={onCloseMock} onDiscard={onDiscardMock} />);

    fireEvent.click(screen.getByRole("button", { name: "Discard" }));

    expect(onDiscardMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("does not render dialog content when open is false", () => {
    const { container } = render(<DiscardMediaDialog open={false} onClose={onCloseMock} onDiscard={onDiscardMock} />);
    expect(container).toBeEmptyDOMElement();
  });
});
