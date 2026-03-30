import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Illustration from "../components/Illustration";

describe("Illustration Component", () => {
  it("renders the illustration image", () => {
    render(<Illustration />);
    const image = screen.getByAltText("Illustration");
    expect(image).toBeInTheDocument();
    expect(image.getAttribute("src")).toMatch(/\/_next\/image\?url=%2Fsignuplock\.png&.*q=75/); // Match dynamic src
  });

  it("renders the Box component with the correct class names", () => {
    render(<Illustration />);
    const box = screen.getByAltText("Illustration").parentElement; // Get the parent Box element
    expect(box).toBeInTheDocument();
    expect(box).toHaveClass("MuiBox-root"); // Verify Material-UI's Box class is applied
  });
});
