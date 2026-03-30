import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import AuthButtons from "../components/AuthButtons";
import "@testing-library/jest-dom";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("AuthButtons Component", () => {
  it("renders all buttons correctly", () => {
    render(<AuthButtons />);

    
    expect(screen.getByText("Sign in with email")).toBeInTheDocument();
  });

  it("navigates correctly when buttons are clicked", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<AuthButtons />);

    fireEvent.click(screen.getByText("Sign in with email"));
    expect(pushMock).toHaveBeenCalledWith("/signInWithEmail");
  });
});
