// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import LinkedInProfile from "../LinkedInProfile";

// // Mock necessary components
// jest.mock("./EducationModal", () => ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: () => void }) =>
//   isOpen ? <div data-testid="education-modal">Education Modal</div> : null
// );

// jest.mock("./ExperienceModal", () => ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: () => void }) =>
//   isOpen ? <div data-testid="experience-modal">Experience Modal</div> : null
// );

// jest.mock("./SkillsModal", () => ({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: () => void }) =>
//   isOpen ? <div data-testid="skills-modal">Skills Modal</div> : null
// );

// jest.mock("./VisibilityDropdown", () => () => <div data-testid="visibility-dropdown">Visibility Dropdown</div>);

// describe("LinkedInProfile Component", () => {
//   test("renders profile component with default data", () => {
//     render(<LinkedInProfile />);
//     expect(screen.getByText("Nooran Haridy")).toBeInTheDocument();
//     expect(screen.getByText("Open to work")).toBeInTheDocument();
//     expect(screen.getByText("Education")).toBeInTheDocument();
//     expect(screen.getByText("Skills"));
//   });

//   test("opens education modal on clicking add education button", () => {
//     render(<LinkedInProfile />);
//     const addEducationButton = screen.getByText("Add Education");
//     fireEvent.click(addEducationButton);
//     expect(screen.getByTestId("education-modal")).toBeInTheDocument();
//   });

//   test("adds a skill when saving a skill", () => {
//     render(<LinkedInProfile />);
//     const addSkillButton = screen.getByText("Add skills");
//     fireEvent.click(addSkillButton);
//     expect(screen.getByTestId("skills-modal")).toBeInTheDocument();
//   });

//   test("deletes education entry", () => {
//     render(<LinkedInProfile />);
//     fireEvent.click(screen.getByText("Add Education"));
//     fireEvent.click(screen.getByText("Education Modal"));
//     fireEvent.click(screen.getByText("Delete Education"));
//     expect(screen.queryByText("Education Modal")).not.toBeInTheDocument();
//   });

//   test("uploads a profile image", () => {
//     render(<LinkedInProfile />);
//     const input = screen.getByLabelText("Upload Profile Image") as HTMLInputElement;
//     const file = new File(["dummy content"], "profile.png", { type: "image/png" });
//     fireEvent.change(input, { target: { files: [file] } });
//     expect(input.files && input.files[0]).toBe(file);
//   });
// });
