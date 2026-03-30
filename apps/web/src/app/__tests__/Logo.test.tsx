import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Logo from "../components/Logo";

describe("Logo Component", () => {
  it("renders the LinkedIn logo", () => {
    render(<Logo />);
    expect(screen.getByText("Linked")).toBeInTheDocument();
    expect(screen.getByText("in")).toBeInTheDocument();
  });

  it("applies correct styles to the logo", () => {
    render(<Logo />);
    const logo = screen.getByText("Linked");

    // Check for font-weight
    expect(logo).toHaveStyle("font-weight: 700");

    // Check for color using getComputedStyle
    const computedStyles = getComputedStyle(logo);
    expect(computedStyles.color).toBe("rgb(25, 118, 210)"); // Replace with the actual primary color value from the theme
  });
});
