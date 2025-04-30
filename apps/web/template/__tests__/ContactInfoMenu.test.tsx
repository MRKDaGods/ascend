import { render, screen, fireEvent } from "@testing-library/react";
import { ContactInfoMenu } from "@/app/components/Profile/ContactInfoMenu"; // Adjust path if needed
import { Profile } from "@ascend/api-client/models";
import React from "react";
import { PhoneType } from "@ascend/api-client/models"; // Ensure PhoneType is imported

// Create a fake anchor element for the menu
const createAnchorEl = () => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  return div;
};

describe("ContactInfoMenu", () => {
  const mockProfile: Profile = {
    contact_info: {
      user_id: 1,
      email: "john.doe@example.com",
      phone_type: PhoneType.MOBILE,
    },
    website: "https://linkedin.com/in/johndoe",
    user_id: 1,
    first_name: "John",
    last_name: "Doe",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const setup = (profile: Profile, isEditable = true) => {
    const onClose = jest.fn();
    const onEdit = jest.fn();
    const anchorEl = createAnchorEl();

    render(
      <ContactInfoMenu
        anchorEl={anchorEl}
        profile={profile}
        isEditable={isEditable}
        onClose={onClose}
        onEdit={onEdit}
      />
    );

    return { onClose, onEdit };
  };

  it("renders the contact info correctly", () => {
    setup(mockProfile);

    expect(screen.getByText("Contact Info")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    if (mockProfile.website) {
      expect(screen.getByText(mockProfile.website)).toBeInTheDocument();
    }
  });

  it("shows the edit button when editable and calls onEdit", () => {
    const { onEdit } = setup(mockProfile, true);

    const button = screen.getByRole("button", { name: /edit contact info/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onEdit).toHaveBeenCalled();
  });

  it("does not show the edit button when not editable", () => {
    setup(mockProfile, false);

    expect(
      screen.queryByRole("button", { name: /edit contact info/i })
    ).not.toBeInTheDocument();
  });

  it("displays default email text when no email is provided", () => {
    const contactInfoWithoutEmail = mockProfile.contact_info
      ? { ...mockProfile.contact_info, email: undefined, user_id: mockProfile.contact_info.user_id }
      : undefined;

    const profileNoEmail: Profile = {
      ...mockProfile,
      contact_info: {
        ...contactInfoWithoutEmail,
        email: contactInfoWithoutEmail?.email || "", // Provide a default empty string for email
        user_id: mockProfile.contact_info?.user_id || 0,
      },
    };

    const anchorEl = createAnchorEl();
    render(
      <ContactInfoMenu
        anchorEl={anchorEl}
        profile={profileNoEmail}
        isEditable={false}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );

    expect(screen.getByText("No email provided")).toBeInTheDocument();
  });

  it("handles missing contact_info gracefully", () => {
    const profileNoContactInfo: Profile = {
      ...mockProfile,
      contact_info: undefined, // Simulate missing contact_info
    };

    const anchorEl = createAnchorEl();
    render(
      <ContactInfoMenu
        anchorEl={anchorEl}
        profile={profileNoContactInfo}
        isEditable={false}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );

    // Check for the default text
    expect(screen.getByText("No email provided")).toBeInTheDocument();
  });
});
