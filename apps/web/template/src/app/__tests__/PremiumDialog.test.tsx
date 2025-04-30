import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PremiumDialog } from "@/app/components/Profile/PremiumDialog"; // Adjust the path if needed

describe("PremiumDialog", () => {
  const mockOnClose = jest.fn();

  const setup = (open: boolean) => {
    render(<PremiumDialog open={open} onClose={mockOnClose} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dialog when open is true", () => {
    setup(true);

    expect(screen.getByText("Try Premium Features")).toBeInTheDocument();
    expect(screen.getByText("Upgrade to Premium")).toBeInTheDocument();
    expect(screen.getByText("Get access to exclusive tools and features to boost your professional network and career.")).toBeInTheDocument();
    expect(screen.getByText("Premium features include:")).toBeInTheDocument();
    expect(screen.getByText("See who viewed your profile")).toBeInTheDocument();
    expect(screen.getByText("Advanced search filters")).toBeInTheDocument();
    expect(screen.getByText("Direct messaging to any professional")).toBeInTheDocument();
    expect(screen.getByText("Access to premium learning courses")).toBeInTheDocument();
    expect(screen.getByText("Try Premium for Free")).toBeInTheDocument();
  });

  it("does not render the dialog when open is false", () => {
    setup(false);

    expect(screen.queryByText("Try Premium Features")).not.toBeInTheDocument();
  });

  it("calls onClose when the close icon is clicked", () => {
    setup(true);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when the 'Try Premium for Free' button is clicked", () => {
    setup(true);

    const tryPremiumButton = screen.getByText("Try Premium for Free");
    fireEvent.click(tryPremiumButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});