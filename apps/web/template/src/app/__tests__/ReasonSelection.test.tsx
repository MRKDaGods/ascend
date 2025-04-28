import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReasonSelection from "../components/ReasonSelection";

describe("ReasonSelection Component", () => {
  const mockSetSelectedReason = jest.fn();

  it("renders the title and all reasons", () => {
    render(<ReasonSelection selectedReason="" setSelectedReason={mockSetSelectedReason} />);

    expect(screen.getByText("Tell us the reason for closing your account:")).toBeInTheDocument();
    expect(screen.getByLabelText("I have a duplicate account")).toBeInTheDocument();
    expect(screen.getByLabelText("I'm getting too many emails")).toBeInTheDocument();
    expect(screen.getByLabelText("I'm not getting any value from my membership")).toBeInTheDocument();
    expect(screen.getByLabelText("I have a privacy concern")).toBeInTheDocument();
    expect(screen.getByLabelText("I'm receiving unwanted contact")).toBeInTheDocument();
    expect(screen.getByLabelText("Other")).toBeInTheDocument();
  });

  it("selects a reason when clicked", () => {
    render(<ReasonSelection selectedReason="" setSelectedReason={mockSetSelectedReason} />);

    const reasonOption = screen.getByLabelText("I have a duplicate account");
    fireEvent.click(reasonOption);

    expect(mockSetSelectedReason).toHaveBeenCalledWith("I have a duplicate account");
  });

  it("highlights the selected reason", () => {
    render(<ReasonSelection selectedReason="I'm getting too many emails" setSelectedReason={mockSetSelectedReason} />);

    const selectedOption = screen.getByLabelText("I'm getting too many emails");
    expect(selectedOption).toBeChecked();
  });
});
