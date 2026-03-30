import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../components/Footer";

describe("Footer Component", () => {
  it("renders the LinkedIn copyright text", () => {
    render(<Footer />);
    const footerElement = document.querySelector("footer span");
    expect(footerElement).toHaveTextContent("Ascend");
    expect(footerElement).toHaveTextContent("© 2025");
  });

  it("renders all footer links", () => {
    render(<Footer />);
    expect(screen.getByText("User Agreement")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Community Guidelines")).toBeInTheDocument();
    expect(screen.getByText("Cookie Policy")).toBeInTheDocument();
    expect(screen.getByText("Copyright Policy")).toBeInTheDocument();
    expect(screen.getByText("Send Feedback")).toBeInTheDocument();
  });

  it("renders the language selector", () => {
    render(<Footer />);
    expect(screen.getByText("Language ⌄")).toBeInTheDocument();
  });
});
