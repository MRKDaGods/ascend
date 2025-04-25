import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PremiumSurvey from "../src/app/components/PremiumSurvey";

describe("PremiumSurvey Component", () => {
  it("renders the first question correctly", () => {
    render(
      <MemoryRouter>
        <PremiumSurvey />
      </MemoryRouter>
    );

    // Check if the first question is displayed
    expect(
      screen.getByText("Which of these best describes your primary goal for using Premium?")
    ).toBeInTheDocument();

    // Check if all options are displayed
    expect(screen.getByText("I'd use Premium for my personal goals")).toBeInTheDocument();
    expect(screen.getByText("I'd use Premium as part of my job")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  it("navigates to the second question when 'I'd use Premium for my personal goals' is selected", () => {
    render(
      <MemoryRouter>
        <PremiumSurvey />
      </MemoryRouter>
    );

    // Select the first option
    fireEvent.click(screen.getByLabelText("I'd use Premium for my personal goals"));

    // Click the Next button
    fireEvent.click(screen.getByText("Next"));

    // Check if the second question is displayed
    expect(screen.getByText("What do you hope to achieve with Premium?")).toBeInTheDocument();

    // Check if the options for the second question are displayed
    expect(screen.getByText("To job search with confidence and get hired")).toBeInTheDocument();
    expect(screen.getByText("To develop my professional skills")).toBeInTheDocument();
  });
});
