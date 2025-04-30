import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditDialog } from "@/app/components/Profile/EditDialog"; // Adjust the path if needed
import { Profile } from "@ascend/api-client/models";

describe("EditDialog", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn().mockResolvedValue({});
  const mockProfile: Profile = {
    user_id: 1,
    first_name: "John",
    last_name: "Doe",
    contact_info: {
      user_id: 1,
      email: "john.doe@example.com",
    },
    created_at: new Date(),
    updated_at: new Date(),
  };

  const setup = (props = {}) => {
    const defaultProps = {
      open: true,
      mode: "profile" as "profile" | "experience" | "education" | "project" | "course" | "skill" | "interest" | null,
      item: null,
      onClose: mockOnClose,
      onSave: mockOnSave,
      formData: {
        first_name: "John",
        last_name: "Doe",
        headline: "Software Engineer",
        additional_name: "",
        name_pronunciation: "",
        industry: "",
        location: "",
        website: "",
        bio: "",
      },
      ...props,
    };

    render(<EditDialog {...defaultProps} />);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dialog with the correct title for 'profile' mode", () => {
    setup({ mode: "profile" });

    expect(screen.getByText("Edit Profile Info")).toBeInTheDocument();
    expect(screen.getByLabelText("First Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
  });

  it("renders the dialog with the correct title for 'experience' mode", () => {
    setup({ mode: "experience" });

    expect(screen.getByText("Edit Experience")).toBeInTheDocument();
    expect(screen.getByLabelText("Company")).toBeInTheDocument();
    expect(screen.getByLabelText("Position")).toBeInTheDocument();
  });

  it("updates form data when input fields are changed", () => {
    setup();

    const firstNameInput = screen.getByLabelText("First Name");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });

    expect(firstNameInput).toHaveValue("Jane");
  });

  it("calls onClose when the cancel button is clicked", () => {
    setup();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onSave with the correct data when the save button is clicked", async () => {
    setup();

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockOnSave).toHaveBeenCalledWith({
      first_name: "John",
      last_name: "Doe",
      headline: "Software Engineer",
      additional_name: "",
      name_pronunciation: "",
      industry: "",
      location: "",
      website: "",
      bio: "",
    }));
  });

  it("disables the save button while submitting", async () => {
    setup();

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    expect(saveButton).toBeDisabled();

    await waitFor(() => expect(saveButton).not.toBeDisabled());
  });

  it("renders additional fields for 'education' mode", () => {
    setup({ mode: "education" });

    expect(screen.getByLabelText("School")).toBeInTheDocument();
    expect(screen.getByLabelText("Degree")).toBeInTheDocument();
    expect(screen.getByLabelText("Field of Study")).toBeInTheDocument();
  });

  it("renders additional fields for 'project' mode", () => {
    setup({ mode: "project" });

    expect(screen.getByLabelText("Project Name")).toBeInTheDocument();
    expect(screen.getByLabelText("URL")).toBeInTheDocument();
  });

  it("renders additional fields for 'course' mode", () => {
    setup({ mode: "course" });

    expect(screen.getByLabelText("Course Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Provider")).toBeInTheDocument();
  });

  it("renders additional fields for 'skill' mode", () => {
    setup({ mode: "skill" });

    expect(screen.getByLabelText("Skill Name")).toBeInTheDocument();
  });

  it("renders additional fields for 'interest' mode", () => {
    setup({ mode: "interest" });

    expect(screen.getByLabelText("Interest Name")).toBeInTheDocument();
  });
});