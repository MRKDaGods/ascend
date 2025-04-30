import { render, screen, fireEvent } from "@testing-library/react";
import { CoverPhoto } from "@/app/components/Profile/CoverPhoto"; // Adjust the import as needed
import { Profile } from "@ascend/api-client/models";

// Mock the handleImageDialogOpen and handleViewImage functions
const mockHandleImageDialogOpen = jest.fn();
const mockHandleViewImage = jest.fn();

describe("CoverPhoto Component", () => {
  test("should display cover photo if profile has a cover_photo_url", () => {
    const mockProfile: Profile = {
      cover_photo_url: "https://example.com/cover.jpg",
      user_id: 12345,
      first_name: "John",
      last_name: "Doe",
      created_at: new Date(),  // Date object
      updated_at: new Date(),
    };

    render(
      <CoverPhoto
        profile={mockProfile}
        isEditable={false}
        handleImageDialogOpen={mockHandleImageDialogOpen}
        handleViewImage={mockHandleViewImage}
      />
    );

    const coverPhotoBox = screen.getByRole("presentation");
    expect(coverPhotoBox).toHaveStyle(
      `background-image: url(${mockProfile.cover_photo_url})`
    );
  });

  test("should call handleViewImage when cover photo is clicked", () => {
    const mockProfile: Profile = {
      cover_photo_url: "https://example.com/cover.jpg",
      user_id: 12345,
      first_name: "John",
      last_name: "Doe",
      created_at: new Date(),
      updated_at: new Date(),
    };

    render(
      <CoverPhoto
        profile={mockProfile}
        isEditable={false}
        handleImageDialogOpen={mockHandleImageDialogOpen}
        handleViewImage={mockHandleViewImage}
      />
    );

    const coverPhotoBox = screen.getByRole("presentation");
    fireEvent.click(coverPhotoBox);
    expect(mockHandleViewImage).toHaveBeenCalledWith(mockProfile.cover_photo_url);
  });

  test("should display 'Click to add a cover photo' if no cover photo and editable", () => {
    render(
      <CoverPhoto
        profile={{
          cover_photo_url: undefined,
          user_id: 0,
          first_name: "",
          last_name: "",
          created_at: new Date(),
          updated_at: new Date(),
        }}
        isEditable={true}
        handleImageDialogOpen={mockHandleImageDialogOpen}
        handleViewImage={mockHandleViewImage}
      />
    );

    const text = screen.getByText("Click to add a cover photo");
    expect(text).toBeInTheDocument();
  });

  test("should call handleImageDialogOpen when clicked and editable with no cover photo", () => {
    render(
      <CoverPhoto
        profile={{
          cover_photo_url: undefined,
          user_id: 0,
          first_name: "",
          last_name: "",
          created_at: new Date(),
          updated_at: new Date(),
        }}
        isEditable={true}
        handleImageDialogOpen={mockHandleImageDialogOpen}
        handleViewImage={mockHandleViewImage}
      />
    );

    const coverPhotoBox = screen.getByRole("presentation");
    fireEvent.click(coverPhotoBox);
    expect(mockHandleImageDialogOpen).toHaveBeenCalledWith("cover");
  });

  test("should not be clickable if no cover photo and not editable", () => {
    render(
      <CoverPhoto
        profile={{
          cover_photo_url: undefined,
          user_id: 0,
          first_name: "",
          last_name: "",
          created_at: new Date(),
          updated_at: new Date(),
        }}
        isEditable={false}
        handleImageDialogOpen={mockHandleImageDialogOpen}
        handleViewImage={mockHandleViewImage}
      />
    );

    const coverPhotoBox = screen.getByRole("presentation");
    fireEvent.click(coverPhotoBox);
    expect(mockHandleImageDialogOpen).not.toHaveBeenCalled();
    expect(mockHandleViewImage).not.toHaveBeenCalled();
  });
});
