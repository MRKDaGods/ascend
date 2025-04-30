import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactInfoSection } from "@/app/components/Profile/ContactInfoSection"; // Adjust path if needed
import { Profile, PhoneType } from "@ascend/api-client/models";
import { Palette } from "@mui/material";

// Mock API
jest.mock("@/api", () => ({
  api: {
    user: {
      deleteResume: jest.fn().mockResolvedValue({}),
    },
  },
}));

describe("ContactInfoSection", () => {
  const mockProfile: Profile = {
    contact_info: {
      user_id: 1,
      email: "john.doe@example.com",
      phone: "123-456-7890",
      phone_type: PhoneType.MOBILE,
    },
    website: "https://linkedin.com/in/johndoe",
    resume_url: "https://example.com/resume.pdf",
    user_id: 1,
    first_name: "John",
    last_name: "Doe",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockPalette: Palette = {
    mode: "light",
  } as Palette;

  const mockSetIsSubmitting = jest.fn();
  const mockSetProfile = jest.fn();
  const mockHandleFileUpload = jest.fn();

  const setup = (profile: Profile, isEditable = true) => {
    render(
      <ContactInfoSection
        profile={profile}
        isEditable={isEditable}
        handleFileUpload={mockHandleFileUpload}
        palette={mockPalette}
        setIsSubmitting={mockSetIsSubmitting}
        setProfile={mockSetProfile}
      />
    );
  };

  it("renders contact info correctly", () => {
    setup(mockProfile);

    expect(screen.getByText("Contact Info")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890 (Mobile)")).toBeInTheDocument();
    expect(screen.getByText("https://linkedin.com/in/johndoe")).toBeInTheDocument();
    expect(screen.getByText("View Resume")).toBeInTheDocument();
  });

  it("displays 'No email provided' when email is missing", () => {
    const profileNoEmail: Profile = {
      ...mockProfile,
      contact_info: {
        ...mockProfile.contact_info,
        email: "", // Simulate missing email with empty string
        user_id: mockProfile.contact_info?.user_id ?? 0, // Explicitly provide user_id with fallback
      },
    };
  
    setup(profileNoEmail);
  
    expect(screen.getByText("No email provided")).toBeInTheDocument();
  });
  
  

  it("displays 'Upload Resume' button when no resume is available and editable", () => {
    const profileNoResume = {
      ...mockProfile,
      resume_url: undefined,
    };

    setup(profileNoResume, true);

    expect(screen.getByText("Upload Resume")).toBeInTheDocument();
  });

  it("does not display 'Upload Resume' button when not editable", () => {
    const profileNoResume = {
      ...mockProfile,
      resume_url: undefined,
    };

    setup(profileNoResume, false);

    expect(screen.queryByText("Upload Resume")).not.toBeInTheDocument();
  });

  it("calls handleFileUpload when uploading a resume", () => {
    const profileNoResume = {
      ...mockProfile,
      resume_url: undefined,
    };

    setup(profileNoResume, true);

    const fileInput = screen.getByLabelText("Upload Resume");
    const file = new File(["resume content"], "resume.pdf", { type: "application/pdf" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockHandleFileUpload).toHaveBeenCalledWith(expect.any(Object), "resume");
  });

  it("calls deleteResume API and updates profile when deleting a resume", async () => {
    setup(mockProfile, true);

    const deleteButton = screen.getByText("Delete Resume");
    fireEvent.click(deleteButton);

    expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
    expect(await screen.findByText("Delete Resume")).toBeInTheDocument();
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });
});