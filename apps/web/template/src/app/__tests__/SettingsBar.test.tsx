import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsBar from "../components/SettingsBar";

describe("SettingsBar Component", () => {
  it("renders the LinkedIn branding in the top bar", () => {
    render(<SettingsBar />);
    expect(screen.getByText("Linked")).toBeInTheDocument();
    expect(screen.getByText("in")).toBeInTheDocument();
  });

  it("renders the settings title", () => {
    render(<SettingsBar />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders all settings sections", () => {
    render(<SettingsBar />);
    const sections = [
      "Account preferences",
      "Sign in & security",
      "Visibility",
      "Data privacy",
      "Advertising data",
      "Notifications",
    ];

    sections.forEach((section) => {
      expect(screen.getByText(section)).toBeInTheDocument();
    });
  });

  it("renders the sidebar with the correct structure", () => {
    render(<SettingsBar />);
    const sidebar = screen.getByText("Settings").closest("nav"); // Ensure the sidebar is rendered as a <nav> element
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveClass("MuiPaper-root"); // Verify Material-UI's Paper class is applied
  });

  it("renders the top bar with correct styles", () => {
    render(<SettingsBar />);
    const topBar = screen.getByText("Linked").parentElement; // Get the top bar Box element
    const styles = getComputedStyle(topBar!); // Use getComputedStyle to verify styles
    expect(styles.width).toBe("100vw");
    expect(styles.height).toBe("60px");
    expect(styles.position).toBe("fixed");
    expect(styles.top).toBe("0px");
    expect(styles.left).toBe("0px");
    expect(styles.zIndex).toBe("10");
  });
});
