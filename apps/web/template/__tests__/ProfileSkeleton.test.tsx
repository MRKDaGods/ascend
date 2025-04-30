import { render, screen } from "@testing-library/react";
import { ProfileSkeleton } from "@/app/components/Profile/ProfileSkeleton"; // Adjust the import as needed

describe("ProfileSkeleton Component", () => {
  test("renders profile skeleton with correct elements", () => {
    render(<ProfileSkeleton />);

    // Check if the profile skeleton elements are rendered
    expect(screen.getByRole("presentation")).toHaveClass("MuiBox-root"); // Checking if the main Box is rendered

    // Check that the first Skeleton (rectangular) is rendered for the cover photo
    const coverSkeleton = screen.getByRole("presentation", { hidden: true });
    expect(coverSkeleton).toHaveClass("MuiSkeleton-root");
    expect(coverSkeleton).toHaveStyle("height: 200px");

    // Check that the profile picture (circular Skeleton) is rendered
    const profilePictureSkeleton = screen.getAllByRole("presentation")[1]; // Profile picture is the second element
    expect(profilePictureSkeleton).toHaveClass("MuiSkeleton-root");
    expect(profilePictureSkeleton).toHaveStyle("width: 150px; height: 150px");

    // Check that the skeleton for the name, job title, and other profile info is rendered
    const textSkeletons = screen.getAllByRole("presentation");
    expect(textSkeletons.length).toBeGreaterThan(3); // Checking if there are enough Skeleton text elements

    // Check that Paper elements with Skeletons are rendered
    const papers = screen.getAllByRole("presentation");
    expect(papers.length).toBeGreaterThan(1); // At least two Paper elements should be present
    
    // Check for Skeletons inside the Paper
    const paperSkeletons = screen.getAllByRole("presentation", { hidden: true });
    expect(paperSkeletons[4]).toHaveClass("MuiSkeleton-root"); // Verify a Skeleton inside Paper
    expect(paperSkeletons[5]).toHaveClass("MuiSkeleton-root"); // Verify another Skeleton inside Paper

    // Check that each skeleton for user details inside Paper is correctly rendered
    const userDetailSkeletons = screen.getAllByRole("presentation");
    expect(userDetailSkeletons.length).toBeGreaterThan(5); // Expect at least 5 skeletons in total
  });
});
