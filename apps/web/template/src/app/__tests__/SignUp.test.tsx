import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import SignUp from "../components/SignUp";
import Footer from "../components/Footer";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the Footer component
jest.mock("../components/Footer", () => () => <div data-testid="footer">Footer Mock</div>);

describe("SignUp Component", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the sign-up form", () => {
    render(<SignUp />);
    expect(screen.getByText("Make the most of your professional life")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Agree & Join")).toBeInTheDocument();
  });

  it("renders the footer", () => {
    render(<SignUp />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("allows typing into the email and password fields", () => {
    render(<SignUp />);
    const emailField = screen.getByLabelText("Email").querySelector("input")!;
    const passwordField = screen.getByLabelText("Password").querySelector("input")!;

    fireEvent.change(emailField, { target: { value: "test@example.com" } });
    fireEvent.change(passwordField, { target: { value: "password123" } });

    expect(emailField).toHaveValue("test@example.com");
    expect(passwordField).toHaveValue("password123");
  });

  it("shows an error message when the server returns an error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<SignUp />);
    const emailField = screen.getByLabelText("Email").querySelector("input")!;
    const passwordField = screen.getByLabelText("Password").querySelector("input")!;
    const submitButton = screen.getByText("Agree & Join");

    fireEvent.change(emailField, { target: { value: "test@example.com" } });
    fireEvent.change(passwordField, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(await screen.findByTestId("error-message")).toHaveTextContent("Error connecting to server.");
  });

  it("shows a success message when the server returns success", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: "Signup successful!" }),
    });

    render(<SignUp />);
    const emailField = screen.getByLabelText("Email").querySelector("input")!;
    const passwordField = screen.getByLabelText("Password").querySelector("input")!;
    const submitButton = screen.getByText("Agree & Join");

    fireEvent.change(emailField, { target: { value: "test@example.com" } });
    fireEvent.change(passwordField, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(await screen.findByTestId("success-message")).toHaveTextContent("Signup successful!");
  });

  it("toggles the password visibility", () => {
    render(<SignUp />);
    const passwordField = screen.getByLabelText("Password").querySelector("input")!;
    const toggleButton = screen.getByText("Show");

    expect(passwordField).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(passwordField).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByText("Hide"));
    expect(passwordField).toHaveAttribute("type", "password");
  });
});
