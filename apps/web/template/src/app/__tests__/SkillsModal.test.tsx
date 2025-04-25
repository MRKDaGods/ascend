import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SkillsModal from "../components/SkillsModal";

describe("SkillsModal Integration", () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
    mockOnClose.mockClear();
  });

  it("renders when open", () => {
    render(<SkillsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    expect(screen.getByText("Add skill")).toBeInTheDocument();
    expect(screen.getByText("Suggested based on your profile")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const { container } = render(<SkillsModal isOpen={false} onSave={mockOnSave} onClose={mockOnClose} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("lets user type a skill and save", () => {
    render(<SkillsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText("Skill (ex: Project Management)"), {
      target: { value: "React" },
    });

    fireEvent.click(screen.getByText("Save"));

    expect(mockOnSave).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ name: "React" }),
    ]));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("fills skill when clicking a suggestion", () => {
    render(<SkillsModal isOpen={true} onSave={mockOnSave} onClose={mockOnClose} />);
    const suggestion = screen.getByText("Customer Service");
    fireEvent.click(suggestion);
    expect(screen.getByDisplayValue("Customer Service")).toBeInTheDocument();
  });
});
