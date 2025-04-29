import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import PremiumPage from "../components/PremiumPage"; // adjust path as needed
import { vi } from "vitest";

// 👇 Mock alert
window.alert = jest.fn();

// 👇 Mock fetch
beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    json: async () => ({
      subscription: {
        id: "sub_001",
        plan: "Premium Plan",
        start_date: "2025-04-01",
      },
      features: [
        { id: "feat_01", name: "Extra Job Applications" },
        { id: "feat_02", name: "Profile Boost" },
      ],
    }),
  });
});

describe("PremiumPage", () => {
  test("renders loading spinner initially", () => {
    render(<PremiumPage />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("displays subscription and features after loading", async () => {
    render(<PremiumPage />);
    await waitFor(() => expect(screen.getByText("Premium Plan")).toBeInTheDocument());

    expect(screen.getByText("Started on: 2025-04-01")).toBeInTheDocument();
    expect(screen.getByText("Extra Job Applications")).toBeInTheDocument();
    expect(screen.getByText("Profile Boost")).toBeInTheDocument();
  });

  test("calls alert on 'Buy Feature' click", async () => {
    render(<PremiumPage />);
    await waitFor(() => screen.getByText("Buy Feature"));

    const buyButtons = screen.getAllByText("Buy Feature");
    fireEvent.click(buyButtons[0]);

    expect(window.alert).toHaveBeenCalledWith("Buying feature: feat_01");
  });

  test("calls alert on 'Subscribe Now' click", async () => {
    render(<PremiumPage />);
    await waitFor(() => screen.getByText("Subscribe Now"));

    const subscribeButton = screen.getByText("Subscribe Now");
    fireEvent.click(subscribeButton);

    expect(window.alert).toHaveBeenCalledWith("Redirecting to subscribe...");
  });

  test("calls alert on 'Cancel Subscription' click", async () => {
    render(<PremiumPage />);
    await waitFor(() => screen.getByText("Cancel Subscription"));

    const cancelButton = screen.getByText("Cancel Subscription");
    fireEvent.click(cancelButton);

    expect(window.alert).toHaveBeenCalledWith("Cancel subscription: sub_001");
  });
});
