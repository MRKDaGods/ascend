import React, { useState } from "react";
import './LinkedInProfile.css';
import { FaPencilAlt, FaTrash, FaPlus, FaImage, FaUniversity, FaFilePdf, FaFileUpload } from 'react-icons/fa';
import { MdAddAPhoto, MdCameraAlt } from 'react-icons/md';
import EducationModal from "./EducationModal"; // Import Education modal
import ExperienceModal from "./ExperienceModal"; // Import Experience modal
import SkillsModal from "./SkillsModal"; // Import SkillsModal
import VisibilityDropdown from "./VisibilityDropdown"; // Import VisibilityDropdown

interface Profile {
  name: string;
  headline: string;
  location: string;
  bannerImage: string;
  profileImage: string;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  description: string;
}

interface Skill {
  name: string;
}

const LinkedInProfile: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isBannerOpen, setIsBannerOpen] = useState<boolean>(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState<boolean>(false);
  const [isEducationOpen, setIsEducationOpen] = useState<boolean>(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState<boolean>(false);
  const [resume, setResume] = useState<File | null>(null); // State for resume upload
  const [profile, setProfile] = useState<Profile>({
    name: 'Nouran Haridy',
    headline: 'CH Bachelor Programs - Faculty of Engineering Cairo University',
    location: 'New Cairo, Cairo, Egypt',
    bannerImage: '',
    profileImage: 'your-uploaded-image-url',
  });
  const [savedEducation, setSavedEducation] = useState<Education | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]); // State for the skills list

  const handleSaveEducation = (education: Education) => {
    setSavedEducation(education); // Save the education data
    setIsEducationOpen(false); // Close the modal after saving
  };

  const handleDeleteEducation = () => {
    if (window.confirm("Are you sure you want to delete this education?")) {
      setSavedEducation(null); // Reset the saved education to null
    }
  };

  const handleBannerImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          bannerImage: reader.result as string,
        }));
        setIsBannerOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: reader.result as string,
        }));
        setIsProfileOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfileImage = () => {
    if (window.confirm("Are you sure you want to delete this profile image?")) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        profileImage: '',
      }));
      setIsProfileOpen(false);
    }
  };

  // Handle Resume Upload
  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  // Delete Resume
  const handleDeleteResume = () => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      setResume(null);
    }
  };

  const handleSaveSkill = (newSkill: Skill) => {
    setSkills((prevSkills) => [...prevSkills, newSkill]); // Update the skills list
  };

  return (
    <div className="linkedin-profile">
      <header className="profile-header">
        <div className="profile-banner">
          {profile.bannerImage ? (
            <img src={profile.bannerImage} className="banner-image" alt="Banner" />
          ) : (
            <div className="banner-placeholder"></div>
          )}
          {profile.bannerImage ? (
            <FaPencilAlt
              className="camera-icon"
              onClick={() => document.getElementById('bannerImageInput')?.click()}
            />
          ) : (
            <MdCameraAlt
              className="camera-icon"
              onClick={() => document.getElementById('bannerImageInput')?.click()}
            />
          )}
          <input
            type="file"
            id="bannerImageInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleBannerImageChange}
          />
        </div>
        <div className="profile-info-container">
          <div className="profile-picture-container" onClick={() => setIsProfileOpen(true)}>
            {profile.profileImage ? (
              <img src={profile.profileImage} className="profile-picture" alt="Profile" />
            ) : (
              <div className="profile-picture-placeholder">
                <MdAddAPhoto className="add-photo-icon" />
              </div>
            )}
          </div>
          <div className="profile-info">
            <div className="profile-name">
              <h1>{profile.name}</h1>
              <div className="profile-icons">
                <a href="https://www.cairo-university.edu.eg/" target="_blank" rel="noopener noreferrer">
                  <FaUniversity className="cairo-university-icon" />
                </a>
                <span className="university-text">Cairo University</span>
              </div>
              <FaPencilAlt className="edit-icon" />
            </div>
            <h2>{profile.headline}</h2>
            <p>{profile.location} <a href="#">· Contact info</a></p>
            <div className="profile-actions">
              <button className="open-to">Open to</button>
              <button className="add-section">Add profile section</button>
              <button className="enhance">Enhance profile</button>
              <button className="more">More</button>
            </div>
          </div>
        </div>
      </header>
      <div className="open-to-work">
        <p>Open to work <FaPencilAlt className="small-edit-icon" /></p>
        <p>Programmer roles</p>
        <a href="#">Show details</a>
      </div>
      <div className="suggested">
        <h3>Suggested for you</h3>
        <p>🔒 Private to you</p>
        <div className="skill-level">
          <span>Intermediate</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="experience-section">
        <h3>Experience</h3>
        <p className="experience-subtext">
          Showcase your accomplishments and get up to <strong>2X</strong> as many profile views and connections
        </p>

        <div className="experience-card">
          <div className="experience-icon">
            <FaImage className="experience-placeholder-icon" />
          </div>
          <div className="experience-info">
            <h4>Job Title</h4>
            <p>Organization</p>
            <p>2023 - Present</p>
          </div>
        </div>

        <button className="add-experience-button" onClick={() => setIsExperienceOpen(true)}>
          Add experience
        </button>
      </div>

      {/* Education Section */}
      <div className="education-section">
        <h3>Education</h3>
        <p className="education-subtext">
          Show your qualifications and be up to <strong>2X</strong> more likely to receive a recruiter InMail
        </p>

        {savedEducation ? (
          <div className="education-item">
            <p>
              <strong>{savedEducation.school}</strong> - {savedEducation.degree} in {savedEducation.field}
            </p>
            <p>
              {savedEducation.startMonth} {savedEducation.startYear} - {savedEducation.endMonth} {savedEducation.endYear}
            </p>
            <p>{savedEducation.description}</p>
            <button className="delete-education-button" onClick={handleDeleteEducation}>
              Delete Education
            </button>
          </div>
        ) : (
          <p>No education added yet.</p>
        )}
        <button className="add-education-button" onClick={() => setIsEducationOpen(true)}>
          Add Education
        </button>
      </div>

      {/* Skills Section */}
      <div className="skills-section">
        <h3>Skills</h3>
        <p className="skills-subtext">
          Communicate your fit for new opportunities – 50% of hirers use skills data to fill their roles
        </p>

        <div className="skills-list">
          {skills.map((skill, index) => (
            <p key={index}>{skill.name}</p>
          ))}
        </div>

        <button className="add-skills-button" onClick={() => setIsSkillsOpen(true)}>
          Add skills
        </button>
      </div>

      {/* Resume Upload Section */}
      <div className="resume-section">
        <h3>Resume</h3>
        <p>Upload your resume to enhance your profile and job applications.</p>
        {resume ? (
          <div className="resume-item">
            <FaFilePdf className="resume-icon" />
            <span className="resume-name">{resume.name}</span>
            <button className="delete-resume-button" onClick={handleDeleteResume}>
              <FaTrash /> Delete
            </button>
          </div>
        ) : (
          <div className="upload-resume">
            <input
              type="file"
              id="resumeUploadInput"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleResumeUpload}
            />
            <button className="upload-resume-button" onClick={() => document.getElementById('resumeUploadInput')?.click()}>
              <FaFileUpload className="upload-icon" /> Upload Resume
            </button>
          </div>
        )}
      </div>

      {/* Education Modal */}
      {isEducationOpen && (
        <EducationModal
          isOpen={isEducationOpen}
          onClose={() => setIsEducationOpen(false)}
          onSave={handleSaveEducation}
        />
      )}

      {/* Experience Modal */}
      {isExperienceOpen && (
        <ExperienceModal
          isOpen={isExperienceOpen}
          onClose={() => setIsExperienceOpen(false)}
          onSave={() => {}}
        />
      )}

      {/* Skills Modal */}
      {isSkillsOpen && (
        <SkillsModal
          isOpen={isSkillsOpen}
          onClose={() => setIsSkillsOpen(false)}
          onSave={handleSaveSkill}
        />
      )}

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Profile Picture</h2>
              <span className="close-button" onClick={() => setIsProfileOpen(false)}>&times;</span>
            </div>
            <div className="modal-body">
              <img src={profile.profileImage} className="full-size-profile" alt="Profile" />
              <div className="visibility-dropdown-container">
                <VisibilityDropdown />
              </div>
              <div className="modal-buttons">
                <div className="left-buttons">
                  <button className="modal-button" onClick={() => document.getElementById('profileImageInput')?.click()}>
                    <FaPencilAlt className="modal-icon" /> Edit
                  </button>
                  <input
                    type="file"
                    id="profileImageInput"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProfileImageChange}
                  />
                  <button className="modal-button">
                    <FaPlus className="modal-icon" /> Add Photos
                  </button>
                  <button className="modal-button">
                    <FaImage className="modal-icon" /> Frames
                  </button>
                </div>
                <button className="modal-button delete-button" onClick={handleDeleteProfileImage}>
                  <FaTrash className="modal-icon" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default LinkedInProfile;