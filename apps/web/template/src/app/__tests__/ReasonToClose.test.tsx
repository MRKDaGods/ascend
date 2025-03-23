import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import ReasonToClose from "../components/ReasonToClose";
import BackButton from "../components/BackButton";
import ReasonSelection from "../components/ReasonSelection";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the BackButton component
jest.mock("../components/BackButton", () => () => <div data-testid="back-button">BackButton Mock</div>);

// Mock the ReasonSelection component
jest.mock("../components/ReasonSelection", () => ({
  __esModule: true,
  default: ({ selectedReason, setSelectedReason }: { selectedReason: string; setSelectedReason: (reason: string) => void }) => (
    <div data-testid="reason-selection">
      <button onClick={() => setSelectedReason("Other")}>Select Other</button>
      <button onClick={() => setSelectedReason("I have a duplicate account")}>Select Duplicate Account</button>
    </div>
  ),
}));

describe("ReasonToClose Component", () => {
  it("renders the back button", () => {
    render(<ReasonToClose username="John Doe" />);
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it("renders the close account content", () => {
    render(<ReasonToClose username="John Doe" />);
    expect(screen.getByText("Close account")).toBeInTheDocument();
    expect(screen.getByText("John Doe, we’re sorry to see you go")).toBeInTheDocument();
  });

  it("renders the ReasonSelection component", () => {
    render(<ReasonToClose username="John Doe" />);
    expect(screen.getByTestId("reason-selection")).toBeInTheDocument();
  });

  it("navigates to the ProvideMoreInfo page when 'Other' is selected", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<ReasonToClose username="John Doe" />);
    fireEvent.click(screen.getByText("Select Other"));
    fireEvent.click(screen.getByText("Next"));

    expect(pushMock).toHaveBeenCalledWith("/ProvideMoreInfo");
  });

  it("navigates to the CloseAccountPassword page when a reason other than 'Other' is selected", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<ReasonToClose username="John Doe" />);
    fireEvent.click(screen.getByText("Select Duplicate Account"));
    fireEvent.click(screen.getByText("Next"));

    expect(pushMock).toHaveBeenCalledWith("/CloseAccountPassword");
  });
});
