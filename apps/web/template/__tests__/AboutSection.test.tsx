import React from 'react'; // Add this line
import { render, screen } from "@testing-library/react";
import { AboutSection } from "@/app/components/Profile/AboutSection"; // Adjust the import path accordingly
import { Profile } from "@ascend/api-client/models";

// Mock data for testing
const mockProfile: Profile = {
  bio: "This is a test bio.",
  user_id: 12345,
  first_name: "John",
  last_name: "Doe",
  created_at: new Date(),  // Date object
  updated_at: new Date(),  // Date object
};

describe("AboutSection", () => {
  const handleEditDialogOpen = jest.fn();

  it("renders profile bio", () => {
    render(
      <AboutSection
        profile={mockProfile}
        isEditable={false}
        handleEditDialogOpen={handleEditDialogOpen}
      />
    );
    // Ensure that we don't pass undefined to getByText
    const bioText = mockProfile?.bio || "No bio provided";
    expect(screen.getByText(bioText)).toBeInTheDocument();
  });

  it("shows default text when no bio is provided", () => {
    render(
      <AboutSection
        profile={{ bio: "", user_id: 0, first_name: "", last_name: "", created_at: new Date(), updated_at: new Date() }}
        isEditable={false}
        handleEditDialogOpen={handleEditDialogOpen}
      />
    );

    // Default bio text when no bio is available
    expect(screen.getByText("No bio provided")).toBeInTheDocument();
  });
});
