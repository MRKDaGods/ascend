import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import LoginBox from "../components/LoginBox";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginBox Component", () => {
  it("renders the login form", () => {
    render(<LoginBox />);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument(); // Target the heading
    expect(screen.getByLabelText("Email or phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    expect(screen.getByText("Keep me logged in")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument(); // Target the button
  });

  it("shows an error for invalid email", () => {
    render(<LoginBox />);
    const emailField = screen.getByLabelText("Email or phone");
    const passwordField = screen.getByLabelText("Password");
    const signInButton = screen.getByRole("button", { name: "Sign in" });

    fireEvent.change(emailField, { target: { value: "invalid-email" } });
    fireEvent.change(passwordField, { target: { value: "password123" } });
    fireEvent.click(signInButton);

    expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
  });

  it("shows an error for short password", () => {
    render(<LoginBox />);
    const emailField = screen.getByLabelText("Email or phone");
    const passwordField = screen.getByLabelText("Password");
    const signInButton = screen.getByRole("button", { name: "Sign in" });

    fireEvent.change(emailField, { target: { value: "test@example.com" } });
    fireEvent.change(passwordField, { target: { value: "short" } });
    fireEvent.click(signInButton);

    expect(screen.getByText("Password must be at least 8 characters long.")).toBeInTheDocument();
  });

  it("navigates to the dashboard on successful login", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<LoginBox />);
    const emailField = screen.getByLabelText("Email or phone");
    const passwordField = screen.getByLabelText("Password");
    const signInButton = screen.getByRole("button", { name: "Sign in" });

    fireEvent.change(emailField, { target: { value: "test@example.com" } });
    fireEvent.change(passwordField, { target: { value: "password123" } });
    fireEvent.click(signInButton);

    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("navigates to the forgot password page", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<LoginBox />);
    fireEvent.click(screen.getByText("Forgot password?"));

    expect(pushMock).toHaveBeenCalledWith("/ForgetPassword");
  });

  it("toggles the password visibility", () => {
    render(<LoginBox />);
    const passwordField = screen.getByLabelText("Password");
    const toggleButton = screen.getByText("Show");

    expect(passwordField).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(passwordField).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByText("Hide"));
    expect(passwordField).toHaveAttribute("type", "password");
  });
});
