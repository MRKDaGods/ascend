import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import CloseAccountPassword from "../components/CloseAccountPassword";
import BackButton from "../components/BackButton";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the BackButton component
jest.mock("../components/BackButton", () => () => <div data-testid="back-button">BackButton Mock</div>);

describe("CloseAccountPassword Component", () => {
  it("renders the back button", () => {
    render(<CloseAccountPassword />);
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("renders the close account content", () => {
    render(<CloseAccountPassword />);
    expect(screen.getByText("Close account")).toBeInTheDocument();
    expect(screen.getByText("Enter your password to close this account")).toBeInTheDocument();
    expect(
      screen.getByText("Unsubscribe me from LinkedIn email communications, including invitations.")
    ).toBeInTheDocument();
  });

  it("enables the 'Done' button when a password is entered", () => {
    render(<CloseAccountPassword />);
    const doneButton = screen.getByText("Done");
    expect(doneButton).toBeDisabled();

    const passwordField = screen.getByLabelText("Password"); // Use getByLabelText for the password field
    fireEvent.change(passwordField, { target: { value: "myPassword123" } });
    expect(doneButton).toBeEnabled();
  });

  it("navigates to the correct route when 'Done' button is clicked", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<CloseAccountPassword />);

    const passwordField = screen.getByLabelText("Password"); // Use getByLabelText for the password field
    fireEvent.change(passwordField, { target: { value: "myPassword123" } });

    const doneButton = screen.getByText("Done");
    fireEvent.click(doneButton);

    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("toggles the unsubscribe checkbox", () => {
    render(<CloseAccountPassword />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
