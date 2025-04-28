import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthSection from "../components/AuthSection";
import AuthButtons from "../components/AuthButtons";
import { useRouter } from "next/navigation";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the AuthButtons component
jest.mock("../components/AuthButtons", () => () => <div data-testid="auth-buttons">AuthButtons Mock</div>);

describe("AuthSection Component", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the welcome message", () => {
    render(<AuthSection />);
    expect(screen.getByText("Welcome to your professional community")).toBeInTheDocument();
  });

  it("renders the AuthButtons component", () => {
    render(<AuthSection />);
    expect(screen.getByTestId("auth-buttons")).toBeInTheDocument();
  });

  it("renders the user agreement, privacy policy, and cookie policy links", () => {
    render(<AuthSection />);
    expect(screen.getByText("User Agreement")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Cookie Policy")).toBeInTheDocument();
  });

  it("renders the 'Join now' link", () => {
    render(<AuthSection />);
    expect(screen.getByText("Join now")).toBeInTheDocument();
  });
});
