import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

describe("ForgotPasswordForm Component", () => {
  it("renders the form title", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText("Forgot password")).toBeInTheDocument();
  });

  it("renders the email or phone input field", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByLabelText("Email or Phone")).toBeInTheDocument();
  });

  it("renders the verification message", () => {
    render(<ForgotPasswordForm />);
    expect(
      screen.getByText(
        "We’ll send a verification code to this email or phone number if it matches an existing LinkedIn account."
      )
    ).toBeInTheDocument();
  });

  it("renders the 'Next' button", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("renders the 'Back' button", () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("allows typing into the email or phone input field", () => {
    render(<ForgotPasswordForm />);
    const inputField = screen.getByLabelText("Email or Phone");
    fireEvent.change(inputField, { target: { value: "test@example.com" } });
    expect(inputField).toHaveValue("test@example.com");
  });

  it("handles 'Next' button click", () => {
    render(<ForgotPasswordForm />);
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);
    // Add assertions for behavior after clicking "Next" if applicable
  });

  it("handles 'Back' button click", () => {
    render(<ForgotPasswordForm />);
    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);
    // Add assertions for behavior after clicking "Back" if applicable
  });
});
