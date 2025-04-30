import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EducationSection } from "@/app/components/Profile/EducationSection"; // Adjust the path if needed
import { Profile } from "@ascend/api-client/models";
import { Palette } from "@mui/material";

describe("EducationSection", () => {
  const mockHandleEditDialogOpen = jest.fn();
  const mockHandleDeleteItem = jest.fn();
  const mockFormatDateHelper = jest.fn((date) => new Date(date).toLocaleDateString());
  const mockPalette: Palette = {
    text: {
      secondary: "#9e9e9e",
    },
  } as Palette;

  const mockProfileWithEducation: Profile = {
    education: [
      {
        id: 1,
        school: "Harvard University",
        degree: "Bachelor's",
        field_of_study: "Computer Science",
        start_date: new Date("2015-09-01"),
        end_date: new Date("2019-06-01").toISOString(),
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        school: "MIT",
        degree: "Master's",
        field_of_study: "Artificial Intelligence",
        start_date: new Date("2019-09-01"),
        end_date: undefined, // Ongoing education
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    user_id: 1,
    first_name: "John",
    last_name: "Doe",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockProfileWithoutEducation: Profile = {
    education: [],
    user_id: 1,
    first_name: "John",
    last_name: "Doe",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const setup = (profile: Profile, isEditable = true) => {
    render(
      <EducationSection
        isEditable={isEditable}
        profile={profile}
        handleEditDialogOpen={mockHandleEditDialogOpen}
        handleDeleteItem={mockHandleDeleteItem}
        formatDateHelper={mockFormatDateHelper}
        palette={mockPalette}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the education section with education items", () => {
    setup(mockProfileWithEducation);

    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Harvard University")).toBeInTheDocument();
    expect(screen.getByText("Bachelor's, Computer Science")).toBeInTheDocument();
    expect(screen.getByText(mockFormatDateHelper("2015-09-01"))).toBeInTheDocument();
    expect(screen.getByText(mockFormatDateHelper("2019-06-01"))).toBeInTheDocument();

    expect(screen.getByText("MIT")).toBeInTheDocument();
    expect(screen.getByText("Master's, Artificial Intelligence")).toBeInTheDocument();
    expect(screen.getByText("Present")).toBeInTheDocument();
  });

  it("renders 'No education added' when there are no education items", () => {
    setup(mockProfileWithoutEducation);

    expect(screen.getByText("No education added")).toBeInTheDocument();
  });

  it("calls handleEditDialogOpen when the add button is clicked", () => {
    setup(mockProfileWithoutEducation, true);

    const addButton = screen.getByRole("button", { name: /add/i });
    fireEvent.click(addButton);

    expect(mockHandleEditDialogOpen).toHaveBeenCalledWith("education");
  });

  it("calls handleEditDialogOpen when the edit button is clicked for an education item", () => {
    setup(mockProfileWithEducation, true);

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(mockHandleEditDialogOpen).toHaveBeenCalledWith("education", mockProfileWithEducation.education?.[0] ?? {});
  });

  it("calls handleDeleteItem when the delete button is clicked for an education item", () => {
    setup(mockProfileWithEducation, true);

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockHandleDeleteItem).toHaveBeenCalledWith("education", mockProfileWithEducation.education?.[0]?.id ?? 0);
  });

  it("does not render edit and delete buttons when not editable", () => {
    setup(mockProfileWithEducation, false);

    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });
});