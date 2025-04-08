import React, { useEffect, useState } from "react";
import './LinkedInProfile.css';
import { FaPencilAlt, FaTrash, FaPlus, FaImage, FaUniversity, FaFilePdf, FaFileUpload } from 'react-icons/fa';
import { MdAddAPhoto, MdCameraAlt } from 'react-icons/md';
import EducationModal from "./EducationModal"; // Import Education modal
import ExperienceModal from "./ExperienceModal"; // Import Experience modal
import SkillsModal from "./SkillsModal"; // Import SkillsModal
import VisibilityDropdown from "./VisibilityDropdown"; // Import VisibilityDropdown
import { api } from "@/api";
import { Profile, Education, Skill } from "@ascend/api-client/models";

const LinkedInProfile: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isBannerOpen, setIsBannerOpen] = useState<boolean>(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState<boolean>(false);
  const [isEducationOpen, setIsEducationOpen] = useState<boolean>(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState<boolean>(false);
  const [resume, setResume] = useState<File | null>(null); // State for resume upload
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedEducation, setSavedEducation] = useState<Education | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]); // State for the skills list

  useEffect(() => {
    // Fake login
    setIsLoggedIn(false);
    api.auth.login("ammar@ascendx.tech", "123").then(() => {
      setIsLoggedIn(true);

      // fetch user data
      api.user.getLocalUserProfile().then((user) => {
        console.log("User data:", user);
        setProfile(user); // Set the profile data
        // Initialize skills from profile if available
        if (user.skills) {
          setSkills(user.skills);
        }
      }).catch((err) => {
        console.log("Cannot fetch user data:", err);
      });
    }).catch((err) => {
      console.log("Cannot login:", err);
    });
  }, []);

  const handleSaveEducation = (education: Education) => {
    // Update the profile with the new education
    if (profile) {
      const updatedProfile = { 
        ...profile, 
        education: profile.education ? [...profile.education, education] : [education] 
      };
      
      // Update via API
      api.user.updateLocalUserProfile(updatedProfile as any)
        .then(updatedProfile => {
          setProfile(updatedProfile);
        })
        .catch(err => {
          console.error("Failed to save education:", err);
        });
    }
    setIsEducationOpen(false);
  };

  const handleDeleteEducation = (education: Education) => {
    if (window.confirm("Are you sure you want to delete this education?")) {
      if (profile && profile.education) {
        const updatedEducation = profile.education.filter(edu => edu.id !== education.id);
        const updatedProfile = { ...profile, education: updatedEducation };
        
        // Update via API
        api.user.updateLocalUserProfile(updatedProfile as any)
          .then(updatedProfile => {
            setProfile(updatedProfile);
          })
          .catch(err => {
            console.error("Failed to delete education:", err);
          });
      }
    }
  };

  const handleBannerImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Upload cover photo via API
      api.user.uploadCoverPhoto(file)
        .then(updatedProfile => {
          setProfile(updatedProfile);
          setIsBannerOpen(false);
        })
        .catch(err => {
          console.error("Failed to upload cover photo:", err);
        });
    }
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Upload profile picture via API
      api.user.uploadProfilePicture(file)
        .then(updatedProfile => {
          setProfile(updatedProfile);
          setIsProfileOpen(false);
        })
        .catch(err => {
          console.error("Failed to upload profile picture:", err);
        });
    }
  };

  const handleDeleteProfileImage = () => {
    if (window.confirm("Are you sure you want to delete this profile image?")) {
      // Delete profile picture via API
      api.user.deleteProfilePicture()
        .then(updatedProfile => {
          setProfile(updatedProfile);
          setIsProfileOpen(false);
        })
        .catch(err => {
          console.error("Failed to delete profile picture:", err);
        });
    }
  };

  // Handle Resume Upload
  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResume(file);
      
      // Upload resume via API
      api.user.uploadResume(file)
        .then(updatedProfile => {
          setProfile(updatedProfile);
        })
        .catch(err => {
          console.error("Failed to upload resume:", err);
        });
    }
  };

  // Delete Resume
  const handleDeleteResume = () => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      setResume(null);
      
      // Delete resume via API
      api.user.deleteResume()
        .then(updatedProfile => {
          setProfile(updatedProfile);
        })
        .catch(err => {
          console.error("Failed to delete resume:", err);
        });
    }
  };

  const handleSaveSkill = (newSkill: Skill) => {
    // Update the local skills state
    setSkills(prevSkills => [...prevSkills, newSkill]);
    
    // Update the profile with the new skill
    if (profile) {
      const updatedSkills = profile.skills ? [...profile.skills, newSkill] : [newSkill];
      const updatedProfile = { ...profile, skills: updatedSkills };
      
      // Update via API
      api.user.updateLocalUserProfile(updatedProfile)
        .then(updatedProfile => {
          setProfile(updatedProfile);
        })
        .catch(err => {
          console.error("Failed to save skill:", err);
        });
    }
  };

  if (!isLoggedIn) {
    return <div>Logging in...</div>;
  }

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="linkedin-profile">
      <header className="profile-header">
        <div className="profile-banner">
          {profile.cover_photo_url ? (
            <img src={profile.cover_photo_url} className="banner-image" alt="Banner" />
          ) : (
            <div className="banner-placeholder"></div>
          )}
          {profile.cover_photo_url ? (
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
            {profile.profile_picture_url ? (
              <img src={profile.profile_picture_url} className="profile-picture" alt="Profile" />
            ) : (
              <div className="profile-picture-placeholder">
                <MdAddAPhoto className="add-photo-icon" />
              </div>
            )}
          </div>
          <div className="profile-info">
            <div className="profile-name">
              <h1>{profile.first_name} {profile.last_name}</h1>
              <div className="profile-icons">
                <a href="https://www.cairo-university.edu.eg/" target="_blank" rel="noopener noreferrer">
                  <FaUniversity className="cairo-university-icon" />
                </a>
                <span className="university-text">Cairo University</span>
              </div>
              <FaPencilAlt className="edit-icon" />
            </div>
            <h2>{profile.bio}</h2>
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

        {profile.experience && profile.experience.length > 0 ? (
          profile.experience.map((exp, index) => (
            <div className="experience-card" key={index}>
              <div className="experience-icon">
                <FaImage className="experience-placeholder-icon" />
              </div>
              <div className="experience-info">
                <h4>{exp.position}</h4>
                <p>{exp.company}</p>
                <p>
                  {exp.start_date ? new Date(exp.start_date).toLocaleDateString() : ''} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                </p>
                {exp.description && <p>{exp.description}</p>}
              </div>
            </div>
          ))
        ) : (
          <p>No experience added yet.</p>
        )}

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

        {profile.education && profile.education.length > 0 ? (
          profile.education.map((edu, index) => (
            <div className="education-item" key={index}>
              <p>
                <strong>{edu.school}</strong> - {edu.degree} in {edu.field_of_study}
              </p>
              <p>
                {edu.start_date ? new Date(edu.start_date).toLocaleDateString() : ''} - {edu.end_date ? edu.end_date : 'Present'}
              </p>
              <p>{/* edu.description */} PLACEHOLDER DESC</p>
              <button className="delete-education-button" onClick={() => handleDeleteEducation(edu)}>
                Delete Education
              </button>
            </div>
          ))
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
          {profile && profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, index) => (
              <p key={index}>{skill.name}</p>
            ))
          ) : (
            <p>No skills added yet.</p>
          )}
        </div>

        <button className="add-skills-button" onClick={() => setIsSkillsOpen(true)}>
          Add skills
        </button>
      </div>

      {/* Resume Upload Section */}
      <div className="resume-section">
        <h3>Resume</h3>
        <p>Upload your resume to enhance your profile and job applications.</p>
        {profile && profile.resume_url ? (
          <div className="resume-item">
            <FaFilePdf className="resume-icon" />
            <span className="resume-name">Resume</span>
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="view-resume-button">
              View Resume
            </a>
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
          onSave={() => { }}
        />
      )}

      {/* Skills Modal */}
      {/* {isSkillsOpen && (
        <SkillsModal
          isOpen={isSkillsOpen}
          onClose={() => setIsSkillsOpen(false)}
          onSave={handleSaveSkill}
        />
      )} */}

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Profile Picture</h2>
              <span className="close-button" onClick={() => setIsProfileOpen(false)}>&times;</span>
            </div>
            <div className="modal-body">
              <img src={profile.profile_picture_url} className="full-size-profile" alt="Profile" />
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