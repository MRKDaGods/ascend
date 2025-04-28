import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DiscardPostDialog from "../components/DiscardPostDialog"; // adjust path if needed

describe("DiscardPostDialog Component", () => {
  const onCloseMock = jest.fn();
  const onDiscardMock = jest.fn();
  const onSaveMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog content correctly when open", () => {
    render(<DiscardPostDialog open={true} onClose={onCloseMock} onDiscard={onDiscardMock} onSave={onSaveMock} />);

    expect(screen.getByText("Save this post as a draft?")).toBeInTheDocument();
    expect(screen.getByText(/The post you started will be here when you return/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save as draft" })).toBeInTheDocument();
  });

  it("calls onDiscard when clicking Discard button", () => {
    render(<DiscardPostDialog open={true} onClose={onCloseMock} onDiscard={onDiscardMock} onSave={onSaveMock} />);

    fireEvent.click(screen.getByRole("button", { name: "Discard" }));

    expect(onDiscardMock).toHaveBeenCalledTimes(1);
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it("calls onSave when clicking Save as draft button", () => {
    render(<DiscardPostDialog open={true} onClose={onCloseMock} onDiscard={onDiscardMock} onSave={onSaveMock} />);

    fireEvent.click(screen.getByRole("button", { name: "Save as draft" }));

    expect(onSaveMock).toHaveBeenCalledTimes(1);
    expect(onDiscardMock).not.toHaveBeenCalled();
  });

  it("does not render dialog content when open is false", () => {
    const { container } = render(<DiscardPostDialog open={false} onClose={onCloseMock} onDiscard={onDiscardMock} onSave={onSaveMock} />);
    expect(container).toBeEmptyDOMElement();
  });
});
