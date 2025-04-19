import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import CloseAccount from "../components/CloseAccount";
import BackButton from "../components/BackButton";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the BackButton component
jest.mock("../components/BackButton", () => () => <div data-testid="back-button">BackButton Mock</div>);

describe("CloseAccount Component", () => {
  it("renders the back button", () => {
    render(<CloseAccount username="John Doe" />);
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("renders the close account content", () => {
    render(<CloseAccount username="John Doe" />);
    expect(screen.getByText("Close account")).toBeInTheDocument();
    expect(screen.getByText("John Doe, we’re sorry to see you go")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to close your account? You’ll lose your connections, messages, endorsements, and recommendations."
      )
    ).toBeInTheDocument();
  });

  it("navigates to the correct route when 'Continue' button is clicked", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<CloseAccount username="John Doe" />);

    fireEvent.click(screen.getByText("Continue"));
    expect(pushMock).toHaveBeenCalledWith("/ReasonToClose");
  });
});
