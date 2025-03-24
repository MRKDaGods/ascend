import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './LinkedInProfile.css'; // Reuse LinkedInProfile styles
import { FaUniversity, FaPencilAlt, FaImage } from 'react-icons/fa';

// Define interfaces for user data structure
interface Experience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate?: string;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface UserData {
  id: string;
  name: string;
  headline?: string;
  location?: string;
  openToWork?: string;
  profileImage?: string;
  bannerImage?: string;
  university?: string;
  universityLink?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Get userId from URL params
  const [userData, setUserData] = useState<UserData | null>(null); // State for user data
  const [error, setError] = useState<string | null>(null); // State for errors

  useEffect(() => {
    // Fetch user data from Mockoon API
    fetch(`http://localhost:3002/users/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data: UserData) => setUserData(data))
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError(error.message);
      });
  }, [userId]);

  if (error) return <p className="error-message">Error: {error}</p>;
  if (!userData) return <p>Loading...</p>; // Show loading message while fetching

  return (
    <div className="linkedin-profile">
      <header className="profile-header">
        <div className="profile-banner">
          {userData.bannerImage ? (
            <img src={userData.bannerImage} className="banner-image" alt="Banner" />
          ) : (
            <div className="banner-placeholder"></div>
          )}
        </div>
        <div className="profile-info-container">
          <div className="profile-picture-container">
            {userData.profileImage ? (
              <img src={userData.profileImage} className="profile-picture" alt="Profile" />
            ) : (
              <div className="profile-picture-placeholder">
                <div className="add-photo-icon">
                  <FaImage />
                </div>
              </div>
            )}
          </div>
          <div className="profile-info">
            <div className="profile-name">
              <h1>{userData.name}</h1>
              {userData.university && (
                <div className="profile-icons">
                  <a href={userData.universityLink} target="_blank" rel="noopener noreferrer">
                    <div className="cairo-university-icon">
                      <FaUniversity />
                    </div>
                  </a>
                  <span className="university-text">{userData.university}</span>
                </div>
              )}
            </div>
            <h2>{userData.headline || "No headline provided"}</h2>
            <p>{userData.location || "Location not specified"}</p>
          </div>
        </div>
      </header>

      <div className="open-to-work">
        <p>Open to work <span className="small-edit-icon"><FaPencilAlt /></span></p>
        <p>{userData.openToWork || "Not specified"}</p>
        <a href="#">Show details</a>
      </div>

      <div className="experience-section">
        <h3>Experience</h3>
        {userData.experience?.length ? (
          userData.experience.map((exp, index) => (
            <div key={index} className="experience-card">
              <div className="experience-icon">
                <div className="experience-placeholder-icon">
                  <FaImage />
                </div>
              </div>
              <div className="experience-info">
                <h4>{exp.jobTitle}</h4>
                <p>{exp.company}</p>
                <p>{exp.startDate} - {exp.endDate || "Present"}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No experience added yet.</p>
        )}
      </div>

      <div className="education-section">
        <h3>Education</h3>
        {userData.education?.length ? (
          userData.education.map((edu, index) => (
            <div key={index} className="education-item">
              <p>
                <strong>{edu.school}</strong> - {edu.degree} in {edu.field}
              </p>
              <p>
                {edu.startDate} - {edu.endDate}
              </p>
              <p>{edu.description || "No description provided"}</p>
            </div>
          ))
        ) : (
          <p>No education added yet.</p>
        )}
      </div>

      <div className="skills-section">
        <h3>Skills</h3>
        {userData.skills?.length ? (
          <div className="skills-list">
            {userData.skills.map((skill, index) => (
              <p key={index}>{skill}</p>
            ))}
          </div>
        ) : (
          <p>No skills added yet.</p>
        )}
      </div>

      {/* Add to Your Feed Section */}
      <div className="add-to-feed-section">
        <h3>Add to your feed</h3>
        <div className="feed-item">
          <div className="feed-icon">
            <FaUniversity className="feed-icon-image" />
          </div>
          <div className="feed-info">
            <h4>Cairo University</h4>
            <p>University</p>
            <button className="follow-button">Follow</button>
          </div>
        </div>
        <div className="feed-item">
          <div className="feed-icon">
            <FaUniversity className="feed-icon-image" />
          </div>
          <div className="feed-info">
            <h4>Harvard University</h4>
            <p>University</p>
            <button className="follow-button">Follow</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
