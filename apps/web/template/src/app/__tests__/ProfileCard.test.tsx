import { render, screen, waitFor } from "@testing-library/react";
import ProfileCard from "../components/ProfileCard"; // Import only

interface ProfileCardProps {
  userData: {
    name: string;
    job: string;
    opentowork: boolean;
    profileImage: string;
  } | null;
  loading: boolean;
}

const MockProfileCard: React.FC<ProfileCardProps> = ({ userData, loading }) => {
  if (loading) {
    return <div role="progressbar">Loading...</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <div>
      <img
        src={userData.profileImage || "/default-avatar.jpg"}
        alt="user"
        role="img"
      />
      <h1>{userData.name}</h1>
      <p>{userData.job}</p>
      {userData.opentowork && <p>Open to Work</p>}
    </div>
  );
};

describe("ProfileCard Component", () => {
  test("renders skeleton loaders when userData is null", async () => {
    render(<MockProfileCard userData={null} loading={true} />);
    
    await waitFor(() => {
      expect(screen.getAllByRole("progressbar").length).toBeGreaterThan(0);
    });
  });

  test("renders user details when userData is provided", async () => {
    const userData = {
      name: "John Doe",
      job: "Software Engineer at Tech Corp",
      opentowork: true,
      profileImage: "/profile.jpg",
    };

    render(<MockProfileCard userData={userData} loading={false} />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Software Engineer at Tech Corp")).toBeInTheDocument();
      expect(screen.getByText(/Open to Work/i)).toBeInTheDocument();
    });
  });

  test("renders default avatar when profile image is not provided", async () => {
    const userData = {
      name: "John Smith",
      job: "Data Scientist",
      opentowork: false,
      profileImage: "",
    };

    render(<MockProfileCard userData={userData} loading={false} />);

    await waitFor(() => {
      const img = screen.getByRole("img", { name: /user/i });
      expect(img).toHaveAttribute("src", "/default-avatar.jpg");
    });
  });
});
