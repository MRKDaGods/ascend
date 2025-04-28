import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SigninHeader from "../components/SigninHeader";

describe("SigninHeader Component", () => {
  it("renders the LinkedIn branding", () => {
    render(<SigninHeader />);
    expect(screen.getByText("Linked")).toBeInTheDocument();
    expect(screen.getByText("in")).toBeInTheDocument();
  });

  it("applies correct styles to the LinkedIn branding", () => {
    render(<SigninHeader />);
    const linkedText = screen.getByText("Linked");
    const inText = screen.getByText("in");

    // Check for font-weight and color for "Linked"
    expect(linkedText).toHaveStyle("font-weight: 700"); // Updated to match numeric font-weight
    const linkedStyles = getComputedStyle(linkedText);
    expect(linkedStyles.color).toBe("rgb(25, 118, 210)"); // Replace with the actual primary color value from the theme

    // Check for background color and text color for "in"
    const inStyles = getComputedStyle(inText);
    expect(inStyles.backgroundColor).toBe("rgb(0, 119, 181)"); // Replace with the actual background color value
    expect(inStyles.color.toLowerCase()).toBe("white"); // Normalize color comparison
  });
});
