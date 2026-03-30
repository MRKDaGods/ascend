import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("BackButton Component", () => {
  it("renders the back button with an icon and text", () => {
    render(<BackButton />);
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByTestId("ArrowBackIcon")).toBeInTheDocument();
  });

  it("calls router.back() when clicked", () => {
    const backMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ back: backMock });

    render(<BackButton />);

    fireEvent.click(screen.getByText("Back"));
    expect(backMock).toHaveBeenCalled();
  });
});
