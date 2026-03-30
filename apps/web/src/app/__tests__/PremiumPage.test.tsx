import "whatwg-fetch";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import PremiumPage from "../components/PremiumPage";
import React from "react";

// ✅ Mock global alert
import { jest } from "@jest/globals";

global.alert = jest.fn();

// ✅ Mock fetch before each test
beforeEach(() => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    json: async () => ({
      subscriptions: [
        {
          subscription_id: "sub_001",
          subscription_plan: "Premium Plan",
          first_payment_data: "2025-04-01",
          amount_paid: 29.99,
          currency: "USD",
        },
      ],
      features: [
        {
          id: "feat_01",
          name: "Extra Job Applications",
          description: "Get 20 extra job applications this month.",
          currency: "USD",
          price: 4.99,
        },
        {
          id: "feat_02",
          name: "Profile Boost",
          description: "Highlight your profile to recruiters.",
          currency: "USD",
          price: 9.99,
        },
      ],
    }),
  } as Response);
});

// ✅ Clear mocks after each test
afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe("PremiumPage", () => {
  test("renders loading spinner initially", () => {
    render(<PremiumPage />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("displays subscription and features after loading", async () => {
    render(<PremiumPage />);

    // Wait for the page to load and display the subscription
    await waitFor(() => screen.getByText("Premium Plan"));

    // Ensure loading spinner is gone
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

    // Check subscription section
    expect(screen.getByText("Started on: 2025-04-01")).toBeInTheDocument();
    expect(screen.getByText("29.99 USD")).toBeInTheDocument();

    // Check features
    expect(screen.getByText("Extra Job Applications")).toBeInTheDocument();
    expect(screen.getByText("Profile Boost")).toBeInTheDocument();
  });

  test("calls alert on 'Buy Feature' click", async () => {
    render(<PremiumPage />);

    // Wait for the features to be rendered
    await waitFor(() => screen.getByText("Buy Feature"));

    const buyButtons = screen.getAllByText("Buy Feature");
    fireEvent.click(buyButtons[0]);

    expect(global.alert).toHaveBeenCalledWith("Buying feature: feat_01");
  });

  test("calls alert on 'Subscribe Now' click", async () => {
    render(<PremiumPage />);

    // Wait for the 'Subscribe Now' button to be rendered
    await waitFor(() => screen.getByText("Subscribe Now"));

    fireEvent.click(screen.getByText("Subscribe Now"));
    expect(global.alert).toHaveBeenCalledWith("Redirecting to subscribe...");
  });

  test("calls alert on 'Cancel Subscription' click", async () => {
    render(<PremiumPage />);

    // Wait for the 'Cancel Subscription' button to be rendered
    await waitFor(() => screen.getByText("Cancel Subscription"));

    fireEvent.click(screen.getByText("Cancel Subscription"));
    expect(global.alert).toHaveBeenCalledWith("Cancel subscription: sub_001");
  });
});
