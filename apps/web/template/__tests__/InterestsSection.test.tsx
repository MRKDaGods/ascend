import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { InterestsSection } from "@/app/components/Profile/InterestsSection"; // Adjust the path if needed
import { Profile } from "@ascend/api-client/models";
import { Palette } from "@mui/material";

describe("InterestsSection", () => {
  const mockHandleEditDialogOpen = jest.fn();
  const mockHandleDeleteItem = jest.fn();
  const mockPalette: Palette = {
    mode: "light",
  } as Palette;

  const mockProfileWithInterests: Profile = {
    interests: [
      { id: 1, name: "Programming" },
      { id: 2, name: "Machine Learning" },
    ],
    user_id: 1,
    first_name: "John",
    last_name: "Doe",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockProfileWithoutInterests: Profile = {
    interests: [],
    user_id: 1,
    first_name: "John",
    last_name: "Doe",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const setup = (profile: Profile, isEditable = true) => {
    render(
      <InterestsSection
        profile={profile}
        isEditable={isEditable}
        handleEditDialogOpen={mockHandleEditDialogOpen}
        handleDeleteItem={mockHandleDeleteItem}
        palette={mockPalette}
      />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the interests section with interests", () => {
    setup(mockProfileWithInterests);

    expect(screen.getByText("Interests")).toBeInTheDocument();
    expect(screen.getByText("Programming")).toBeInTheDocument();
    expect(screen.getByText("Machine Learning")).toBeInTheDocument();
  });

  it("renders 'No interests added' when there are no interests", () => {
    setup(mockProfileWithoutInterests);

    expect(screen.getByText("No interests added")).toBeInTheDocument();
  });

  it("calls handleEditDialogOpen when the add button is clicked", () => {
    setup(mockProfileWithoutInterests, true);

    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    expect(mockHandleEditDialogOpen).toHaveBeenCalledWith("interest");
  });

  it("calls handleDeleteItem when the delete button is clicked for an interest", () => {
    setup(mockProfileWithInterests, true);

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockHandleDeleteItem).toHaveBeenCalledWith("interest", mockProfileWithInterests.interests?.[0]?.id ?? 0);
  });

  it("does not render delete buttons when not editable", () => {
    setup(mockProfileWithInterests, false);

    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });

  it("renders the add button only when editable", () => {
    setup(mockProfileWithoutInterests, true);

    expect(screen.getByRole("button")).toBeInTheDocument();

    setup(mockProfileWithoutInterests, false);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});