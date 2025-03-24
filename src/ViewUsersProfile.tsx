import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./ViewUsersProfile.css"; // Import CSS file for styling
import { FaCheck } from "react-icons/fa"; // Import the checkmark icon

// Define the structure of a user
interface User {
  id: string;
  name: string;
  title?: string;
  profileImage?: string;
  isFollowed: boolean;
}

const ViewUsersProfile: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // State with type safety

  useEffect(() => {
    fetch("http://localhost:3002/users") // Mockoon API endpoint
      .then((response) => response.json())
      .then((data: User[]) =>
        setUsers(
          data.map((user) => ({
            ...user,
            isFollowed: false, // Add an `isFollowed` property
          }))
        )
      )
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Function to toggle follow status
  const handleFollow = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isFollowed: !user.isFollowed } : user
      )
    );
  };

  return (
    <div className="users-profile-container">
      <div className="header">
        <h3 className="section-title">Add to your feed</h3>
        <span className="info-icon" title="Get personalized recommendations">ℹ️</span>
      </div>

      {users.map((user) => (
        <div key={user.id} className="user-card">
          <img src={user.profileImage ?? "/default-avatar.png"} alt={user.name} className="user-avatar" />
          <div className="user-info">
            <Link to={`/user/${user.id}`} className="user-name">
              {user.name}
            </Link>
            <p className="user-title">{user.title ?? "No title available"}</p>
          </div>
          <button
            className={`follow-button ${user.isFollowed ? "followed" : ""}`}
            onClick={() => handleFollow(user.id)}
          >
            {user.isFollowed ? (
              <>
                <FaCheck /> Followed
              </>
            ) : (
              "+ Follow"
            )}
          </button>
        </div>
      ))}

      <a href="#" className="view-all">View all recommendations →</a>
    </div>
  );
};

export default ViewUsersProfile;

// Removed JSON configuration object
