import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import ProvideMoreInfo from "../components/ProvideMoreInfo";
import BackButton from "../components/BackButton";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the BackButton component
jest.mock("../components/BackButton", () => () => <div data-testid="back-button">BackButton Mock</div>);

describe("ProvideMoreInfo Component", () => {
  it("renders the back button", () => {
    render(<ProvideMoreInfo />);
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("renders the close account content", () => {
    render(<ProvideMoreInfo />);
    expect(screen.getByText("Close account")).toBeInTheDocument();
    expect(screen.getByText("Please provide a little more information to help us improve")).toBeInTheDocument();
    expect(screen.getByText("Reason for closing account")).toBeInTheDocument();
  });

  it("allows typing into the feedback input field", () => {
    render(<ProvideMoreInfo />);
    const feedbackField = screen.getByRole("textbox");
    fireEvent.change(feedbackField, { target: { value: "I no longer need this account." } });
    expect(feedbackField).toHaveValue("I no longer need this account.");
  });

  it("shows an error message when 'Next' is clicked without entering feedback", () => {
    render(<ProvideMoreInfo />);
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    expect(screen.getByText("Please provide a reason for closing your account.")).toBeInTheDocument();
  });

  it("navigates to the correct route when valid feedback is entered and 'Next' is clicked", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<ProvideMoreInfo />);
    const feedbackField = screen.getByRole("textbox");
    const nextButton = screen.getByText("Next");

    fireEvent.change(feedbackField, { target: { value: "I no longer need this account." } });
    fireEvent.click(nextButton);

    expect(pushMock).toHaveBeenCalledWith("/CloseAccountPassword");
  });
});
