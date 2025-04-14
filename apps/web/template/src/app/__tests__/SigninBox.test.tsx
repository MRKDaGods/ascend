import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import SigninBox from "../components/SigninBox";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SigninBox Component", () => {
  it("renders the welcome text", () => {
    render(<SigninBox />);
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(
      screen.getByText("Don’t miss your next opportunity. Sign in to stay updated on your professional world.")
    ).toBeInTheDocument();
  });

  it("renders the user account box", () => {
    render(<SigninBox />);
    expect(screen.getByText("Mehrati Sameh")).toBeInTheDocument();
    expect(screen.getByText("m*****@gmail.com")).toBeInTheDocument();
    expect(screen.getByTestId("MoreVertIcon")).toBeInTheDocument();
  });

  it("renders the 'Sign in using another account' option", () => {
    render(<SigninBox />);
    expect(screen.getByText("Sign in using another account")).toBeInTheDocument();
  });

  it("renders the 'Join now' link", () => {
    render(<SigninBox />);
    expect(screen.getByText("Join now")).toBeInTheDocument();
  });

  it("navigates to the signup page when 'Sign in using another account' is clicked", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<SigninBox />);
    fireEvent.click(screen.getByText("Sign in using another account"));

    expect(pushMock).toHaveBeenCalledWith("/signup");
  });

  it("navigates to the 'New to LinkedIn' page when 'Join now' is clicked", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<SigninBox />);
    fireEvent.click(screen.getByText("Join now"));

    expect(pushMock).toHaveBeenCalledWith("/NewToLinkedin");
  });
});
