import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import AccountManagement from "../components/AccountManagement";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("AccountManagement Component", () => {
  it("renders the account management title", () => {
    render(<AccountManagement />);
    expect(screen.getByText("Account management")).toBeInTheDocument();
  });

  it("renders the list items", () => {
    render(<AccountManagement />);
    expect(screen.getByText("Hibernate account")).toBeInTheDocument();
    expect(screen.getByText("Close account")).toBeInTheDocument();
  });

  it("navigates to the correct route when 'Close account' is clicked", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<AccountManagement />);

    fireEvent.click(screen.getByText("Close account"));
    expect(pushMock).toHaveBeenCalledWith("/CloseAccount");
  });
});
