import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Header Component", () => {
  it("renders the LinkedIn logo", () => {
    render(<Header />);
    expect(screen.getByText("Linked")).toBeInTheDocument();
    expect(screen.getByText("in")).toBeInTheDocument();
  });

  it("renders the 'Join now' button", () => {
    render(<Header />);
    expect(screen.getByText("Join now")).toBeInTheDocument();
  });

  it("renders the 'Sign in' button", () => {
    render(<Header />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("navigates to the correct route when 'Join now' button is clicked", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<Header />);

    fireEvent.click(screen.getByText("Join now"));
    expect(pushMock).toHaveBeenCalledWith("/signInWithEmail");
  });

  it("navigates to the correct route when 'Sign in' button is clicked", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<Header />);

    fireEvent.click(screen.getByText("Sign in"));
    expect(pushMock).toHaveBeenCalledWith("/signup");
  });
});
