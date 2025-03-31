import React, { useEffect, useState } from "react";
import { api } from "../../services/auth/handlers";
import {
  Profile,
  Education,
  Experience,
  Project,
  Course,
  Skill,
  Interest,
  PhoneType,
} from "@ascend/api-client/models";
import { Accordion, AccordionItem } from "../common/Accordion";

// Define types for editable sections
type EditableSection =
  | "basicInfo"
  | "contactInfo"
  | "education"
  | "experience"
  | "projects"
  | "courses"
  | "skills"
  | "interests";

export const UserProfileForm: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editSection, setEditSection] = useState<EditableSection | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Form states for different sections
  const [basicInfoForm, setBasicInfoForm] = useState<Partial<Profile>>({});
  const [contactInfoForm, setContactInfoForm] = useState<
    Partial<Profile["contact_info"]>
  >({});

  // For items with arrays (education, experience, etc.)
  const [educationForm, setEducationForm] = useState<Education[]>([]);
  const [experienceForm, setExperienceForm] = useState<Experience[]>([]);
  const [projectsForm, setProjectsForm] = useState<Project[]>([]);
  const [coursesForm, setCoursesForm] = useState<Course[]>([]);
  const [skillsForm, setSkillsForm] = useState<Skill[]>([]);
  const [interestsForm, setInterestsForm] = useState<Interest[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await api.user.getLocalUserProfile();
        setProfile(userProfile);

        // Initialize form states with current values
        resetFormStates(userProfile);

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const resetFormStates = (userProfile: Profile) => {
    setBasicInfoForm({
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      additional_name: userProfile.additional_name,
      name_pronunciation: userProfile.name_pronunciation,
      industry: userProfile.industry,
      location: userProfile.location,
      bio: userProfile.bio,
      website: userProfile.website,
    });

    setContactInfoForm(userProfile.contact_info || {});
    setEducationForm(userProfile.education || []);
    setExperienceForm(userProfile.experience || []);
    setProjectsForm(userProfile.projects || []);
    setCoursesForm(userProfile.courses || []);
    setSkillsForm(userProfile.skills || []);
    setInterestsForm(userProfile.interests || []);
  };

  const handleSaveProfile = async (section: EditableSection) => {
    if (!profile) return;

    try {
      setSaveLoading(true);

      let updatedProfile: Partial<Profile> & {
        first_name: string;
        last_name: string;
      } = {
        first_name: profile.first_name,
        last_name: profile.last_name,
      };

      // Add the appropriate section data
      switch (section) {
        case "basicInfo":
          updatedProfile = {
            ...updatedProfile,
            ...basicInfoForm,
          };
          break;
        case "contactInfo":
          updatedProfile = {
            ...updatedProfile,
            contact_info: contactInfoForm as Profile["contact_info"],
          };
          break;
        case "education":
          updatedProfile = {
            ...updatedProfile,
            education: educationForm,
          };
          break;
        case "experience":
          updatedProfile = {
            ...updatedProfile,
            experience: experienceForm,
          };
          break;
        case "projects":
          updatedProfile = {
            ...updatedProfile,
            projects: projectsForm,
          };
          break;
        case "courses":
          updatedProfile = {
            ...updatedProfile,
            courses: coursesForm,
          };
          break;
        case "skills":
          updatedProfile = {
            ...updatedProfile,
            skills: skillsForm,
          };
          break;
        case "interests":
          updatedProfile = {
            ...updatedProfile,
            interests: interestsForm,
          };
          break;
      }

      // Call API to update profile
      const updatedProfileData = await api.user.updateLocalUserProfile(
        updatedProfile
      );

      // Update local state
      setProfile(updatedProfileData);
      resetFormStates(updatedProfileData);
      setEditSection(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaveLoading(false);
    }
  };

  const renderEditButtons = (section: EditableSection) => {
    if (editSection === section) {
      return (
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <button
            onClick={() => handleSaveProfile(section)}
            disabled={saveLoading}
            style={{
              padding: "5px 10px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {saveLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setEditSection(null);
              if (profile) resetFormStates(profile);
            }}
            disabled={saveLoading}
            style={{
              padding: "5px 10px",
              background: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => setEditSection(section)}
        style={{
          padding: "5px 10px",
          background: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "15px",
        }}
      >
        Edit
      </button>
    );
  };

  // Form components for each section
  const renderBasicInfoForm = () => (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
    >
      <div>
        <label>First Name*:</label>
        <input
          type="text"
          value={basicInfoForm.first_name || ""}
          onChange={(e) =>
            setBasicInfoForm({ ...basicInfoForm, first_name: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          required
        />
      </div>
      <div>
        <label>Last Name*:</label>
        <input
          type="text"
          value={basicInfoForm.last_name || ""}
          onChange={(e) =>
            setBasicInfoForm({ ...basicInfoForm, last_name: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          required
        />
      </div>
      <div>
        <label>Additional Name:</label>
        <input
          type="text"
          value={basicInfoForm.additional_name || ""}
          onChange={(e) =>
            setBasicInfoForm({
              ...basicInfoForm,
              additional_name: e.target.value,
            })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <div>
        <label>Name Pronunciation:</label>
        <input
          type="text"
          value={basicInfoForm.name_pronunciation || ""}
          onChange={(e) =>
            setBasicInfoForm({
              ...basicInfoForm,
              name_pronunciation: e.target.value,
            })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <div>
        <label>Industry:</label>
        <input
          type="text"
          value={basicInfoForm.industry || ""}
          onChange={(e) =>
            setBasicInfoForm({ ...basicInfoForm, industry: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          value={basicInfoForm.location || ""}
          onChange={(e) =>
            setBasicInfoForm({ ...basicInfoForm, location: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <div style={{ gridColumn: "1 / span 2" }}>
        <label>Bio:</label>
        <textarea
          value={basicInfoForm.bio || ""}
          onChange={(e) =>
            setBasicInfoForm({ ...basicInfoForm, bio: e.target.value })
          }
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            minHeight: "100px",
          }}
        />
      </div>
      <div style={{ gridColumn: "1 / span 2" }}>
        <label>Website:</label>
        <input
          type="url"
          value={basicInfoForm.website || ""}
          onChange={(e) =>
            setBasicInfoForm({ ...basicInfoForm, website: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
    </div>
  );

  const renderContactInfoForm = () => (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
    >
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={contactInfoForm?.email || ""}
          onChange={(e) =>
            setContactInfoForm({ ...contactInfoForm, email: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          disabled // Email should be managed through auth
        />
        <small style={{ color: "#666" }}>
          Email can only be changed through account settings
        </small>
      </div>
      <div>
        <label>Phone:</label>
        <input
          type="tel"
          value={contactInfoForm?.phone || ""}
          onChange={(e) =>
            setContactInfoForm({ ...contactInfoForm, phone: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <div>
        <label>Phone Type:</label>
        <select
          value={contactInfoForm?.phone_type || ""}
          onChange={(e) =>
            setContactInfoForm({
              ...contactInfoForm,
              phone_type: e.target.value as PhoneType,
            })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        >
          <option value="">Select Type</option>
          <option value={PhoneType.MOBILE}>Mobile</option>
          <option value={PhoneType.HOME}>Home</option>
          <option value={PhoneType.WORK}>Work</option>
        </select>
      </div>
      <div>
        <label>Birthday:</label>
        <input
          type="date"
          value={
            contactInfoForm?.birthday
              ? new Date(contactInfoForm.birthday).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            setContactInfoForm({
              ...contactInfoForm,
              birthday: new Date(e.target.value),
            })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <div style={{ gridColumn: "1 / span 2" }}>
        <label>Address:</label>
        <textarea
          value={contactInfoForm?.address || ""}
          onChange={(e) =>
            setContactInfoForm({ ...contactInfoForm, address: e.target.value })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <div style={{ gridColumn: "1 / span 2" }}>
        <label>Profile URL:</label>
        <input
          type="url"
          value={contactInfoForm?.profile_url || ""}
          onChange={(e) =>
            setContactInfoForm({
              ...contactInfoForm,
              profile_url: e.target.value,
            })
          }
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
    </div>
  );

  // Form handlers for array items (education, experience, projects, etc.)
  const handleAddEducation = () => {
    // Create a new empty education entry with default values
    const newEducation: Partial<Education> = {
      school: "",
      degree: "",
      field_of_study: "",
      start_date: new Date(),
    };
    setEducationForm([...educationForm, newEducation as Education]);
  };

  const handleUpdateEducation = (
    index: number,
    field: keyof Education,
    value: any
  ) => {
    const updatedEducation = [...educationForm];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setEducationForm(updatedEducation);
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = [...educationForm];
    updatedEducation.splice(index, 1);
    setEducationForm(updatedEducation);
  };

  const renderEducationForm = () => (
    <div>
      {educationForm.map((edu, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <h4>Education #{index + 1}</h4>
            <button
              onClick={() => handleRemoveEducation(index)}
              style={{
                color: "red",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label>School:</label>
              <input
                type="text"
                value={edu.school || ""}
                onChange={(e) =>
                  handleUpdateEducation(index, "school", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div>
              <label>Degree:</label>
              <input
                type="text"
                value={edu.degree || ""}
                onChange={(e) =>
                  handleUpdateEducation(index, "degree", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div>
              <label>Field of Study:</label>
              <input
                type="text"
                value={edu.field_of_study || ""}
                onChange={(e) =>
                  handleUpdateEducation(index, "field_of_study", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div>
              <label>Start Date:</label>
              <input
                type="date"
                value={
                  edu.start_date instanceof Date
                    ? edu.start_date.toISOString().split("T")[0]
                    : new Date(edu.start_date).toISOString().split("T")[0]
                }
                onChange={(e) =>
                  handleUpdateEducation(
                    index,
                    "start_date",
                    new Date(e.target.value)
                  )
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div>
              <label>End Date (leave empty if current):</label>
              <input
                type="date"
                value={
                  edu.end_date
                    ? typeof edu.end_date === "string"
                      ? edu.end_date.split("T")[0]
                      : new Date(edu.end_date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleUpdateEducation(
                    index,
                    "end_date",
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddEducation}
        style={{
          padding: "8px 15px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Add Education
      </button>
    </div>
  );

  // Experience handlers
  const handleAddExperience = () => {
    const newExperience: Partial<Experience> = {
      company: "",
      position: "",
      description: "",
      start_date: new Date(),
    };
    setExperienceForm([...experienceForm, newExperience as Experience]);
  };

  const handleUpdateExperience = (
    index: number,
    field: keyof Experience,
    value: any
  ) => {
    const updatedExperience = [...experienceForm];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setExperienceForm(updatedExperience);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperience = [...experienceForm];
    updatedExperience.splice(index, 1);
    setExperienceForm(updatedExperience);
  };

  // Projects handlers
  const handleAddProject = () => {
    const newProject: Partial<Project> = {
      name: "",
      description: "",
      start_date: new Date(),
      url: "",
    };
    setProjectsForm([...projectsForm, newProject as Project]);
  };

  const handleUpdateProject = (
    index: number,
    field: keyof Project,
    value: any
  ) => {
    const updatedProjects = [...projectsForm];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjectsForm(updatedProjects);
  };

  const handleRemoveProject = (index: number) => {
    const updatedProjects = [...projectsForm];
    updatedProjects.splice(index, 1);
    setProjectsForm(updatedProjects);
  };

  // Courses handlers
  const handleAddCourse = () => {
    const newCourse: Partial<Course> = {
      name: "",
      provider: "",
      completion_date: undefined,
    };
    setCoursesForm([...coursesForm, newCourse as Course]);
  };

  const handleUpdateCourse = (
    index: number,
    field: keyof Course,
    value: any
  ) => {
    const updatedCourses = [...coursesForm];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCoursesForm(updatedCourses);
  };

  const handleRemoveCourse = (index: number) => {
    const updatedCourses = [...coursesForm];
    updatedCourses.splice(index, 1);
    setCoursesForm(updatedCourses);
  };

  const renderExperienceForm = () => (
    <div>
      {experienceForm.map((exp, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <h4>Experience #{index + 1}</h4>
            <button
              onClick={() => handleRemoveExperience(index)}
              style={{
                color: "red",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label>Company:</label>
              <input
                type="text"
                value={exp.company || ""}
                onChange={(e) =>
                  handleUpdateExperience(index, "company", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div>
              <label>Position:</label>
              <input
                type="text"
                value={exp.position || ""}
                onChange={(e) =>
                  handleUpdateExperience(index, "position", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ gridColumn: "1 / span 2" }}>
              <label>Description:</label>
              <textarea
                value={exp.description || ""}
                onChange={(e) =>
                  handleUpdateExperience(index, "description", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  minHeight: "80px",
                }}
              />
            </div>
            <div>
              <label>Start Date:</label>
              <input
                type="date"
                value={
                  exp.start_date instanceof Date
                    ? exp.start_date.toISOString().split("T")[0]
                    : new Date(exp.start_date).toISOString().split("T")[0]
                }
                onChange={(e) =>
                  handleUpdateExperience(
                    index,
                    "start_date",
                    new Date(e.target.value)
                  )
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div>
              <label>End Date (leave empty if current):</label>
              <input
                type="date"
                value={
                  exp.end_date instanceof Date
                    ? exp.end_date.toISOString().split("T")[0]
                    : exp.end_date
                    ? new Date(exp.end_date).toISOString().split("T")[0]
                    : undefined
                }
                onChange={(e) =>
                  handleUpdateExperience(
                    index,
                    "end_date",
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddExperience}
        style={{
          padding: "8px 15px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Add Experience
      </button>
    </div>
  );

  const renderProjectsForm = () => (
    <div>
      {projectsForm.map((project, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <h4>Project #{index + 1}</h4>
            <button
              onClick={() => handleRemoveProject(index)}
              style={{
                color: "red",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label>Project Name:</label>
              <input
                type="text"
                value={project.name || ""}
                onChange={(e) =>
                  handleUpdateProject(index, "name", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div>
              <label>URL:</label>
              <input
                type="url"
                value={project.url || ""}
                onChange={(e) =>
                  handleUpdateProject(index, "url", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ gridColumn: "1 / span 2" }}>
              <label>Description:</label>
              <textarea
                value={project.description || ""}
                onChange={(e) =>
                  handleUpdateProject(index, "description", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  minHeight: "80px",
                }}
              />
            </div>
            <div>
              <label>Start Date:</label>
              <input
                type="date"
                value={
                  project.start_date instanceof Date
                    ? project.start_date.toISOString().split("T")[0]
                    : new Date(project.start_date).toISOString().split("T")[0]
                }
                onChange={(e) =>
                  handleUpdateProject(
                    index,
                    "start_date",
                    new Date(e.target.value)
                  )
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div>
              <label>End Date (leave empty if current):</label>
              <input
                type="date"
                value={
                  project.end_date instanceof Date
                    ? project.end_date.toISOString().split("T")[0]
                    : project.end_date
                    ? new Date(project.end_date).toISOString().split("T")[0]
                    : undefined
                }
                onChange={(e) =>
                  handleUpdateProject(
                    index,
                    "end_date",
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddProject}
        style={{
          padding: "8px 15px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Add Project
      </button>
    </div>
  );

  const renderCoursesForm = () => (
    <div>
      {coursesForm.map((course, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <h4>Course #{index + 1}</h4>
            <button
              onClick={() => handleRemoveCourse(index)}
              style={{
                color: "red",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label>Course Name:</label>
              <input
                type="text"
                value={course.name || ""}
                onChange={(e) =>
                  handleUpdateCourse(index, "name", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div>
              <label>Provider:</label>
              <input
                type="text"
                value={course.provider || ""}
                onChange={(e) =>
                  handleUpdateCourse(index, "provider", e.target.value)
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div>
              <label>Completion Date:</label>
              <input
                type="date"
                value={
                  course.completion_date
                    ? new Date(course.completion_date)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleUpdateCourse(
                    index,
                    "completion_date",
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddCourse}
        style={{
          padding: "8px 15px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Add Course
      </button>
    </div>
  );

  // Skills handlers
  const handleAddSkill = () => {
    const newSkill: Partial<Skill> = {
      name: "",
    };
    setSkillsForm([...skillsForm, newSkill as Skill]);
  };

  const handleUpdateSkill = (index: number, field: keyof Skill, value: any) => {
    const updatedSkills = [...skillsForm];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setSkillsForm(updatedSkills);
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skillsForm];
    updatedSkills.splice(index, 1);
    setSkillsForm(updatedSkills);
  };

  const renderSkillsForm = () => (
    <div>
      {skillsForm.map((skill, index) => (
        <div
          key={index}
          style={{
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #eee",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={skill.name || ""}
            onChange={(e) => handleUpdateSkill(index, "name", e.target.value)}
            placeholder="Skill name"
            style={{ flex: 1, padding: "8px", marginRight: "10px" }}
          />
          <button
            onClick={() => handleRemoveSkill(index)}
            style={{
              color: "red",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={handleAddSkill}
        style={{
          padding: "8px 15px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Add Skill
      </button>
    </div>
  );

  // Interests handlers
  const handleAddInterest = () => {
    const newInterest: Partial<Interest> = {
      name: "",
    };
    setInterestsForm([...interestsForm, newInterest as Interest]);
  };

  const handleUpdateInterest = (
    index: number,
    field: keyof Interest,
    value: any
  ) => {
    const updatedInterests = [...interestsForm];
    updatedInterests[index] = { ...updatedInterests[index], [field]: value };
    setInterestsForm(updatedInterests);
  };

  const handleRemoveInterest = (index: number) => {
    const updatedInterests = [...interestsForm];
    updatedInterests.splice(index, 1);
    setInterestsForm(updatedInterests);
  };

  const renderInterestsForm = () => (
    <div>
      {interestsForm.map((interest, index) => (
        <div
          key={index}
          style={{
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #eee",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={interest.name || ""}
            onChange={(e) =>
              handleUpdateInterest(index, "name", e.target.value)
            }
            placeholder="Interest name"
            style={{ flex: 1, padding: "8px", marginRight: "10px" }}
          />
          <button
            onClick={() => handleRemoveInterest(index)}
            style={{
              color: "red",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={handleAddInterest}
        style={{
          padding: "8px 15px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Add Interest
      </button>
    </div>
  );

  const handleProfilePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | null
  ) => {
    if (!profile) return;

    if (e && (!e.target.files || e.target.files.length === 0)) return;

    const file = e ? e.target.files![0] : null;
    try {
      setSaveLoading(true);

      const newProfile = file
        ? await api.user.uploadProfilePicture(file)
        : await api.user.deleteProfilePicture();

      // Update local state
      setProfile({
        ...profile,
        profile_picture_url: newProfile.profile_picture_url,
      });

      alert("Profile picture updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      alert("Failed to update profile picture. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const renderProfilePictureForm = () => {
    if (!profile) return null;

    return (
      <div>
        <strong>Profile Picture:</strong>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          {profile.profile_picture_url && (
            <div>
              <img
                src={profile.profile_picture_url}
                alt="Profile"
                style={{
                  maxWidth: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <button onClick={() => handleProfilePictureUpload(null)}>
                Delete
              </button>
            </div>
          )}
          <label
            htmlFor="profile-picture-upload"
            style={{
              display: "inline-block",
              padding: "8px 15px",
              background: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Upload Profile Picture
          </label>
          <input
            id="profile-picture-upload"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>
    );
  };

  const handleCoverPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | null
  ) => {
    if (!profile) return;
    if (e && (!e.target.files || e.target.files.length === 0)) return;

    const file = e ? e.target.files![0] : null;
    try {
      setSaveLoading(true);

      const newProfile = file
        ? await api.user.uploadCoverPhoto(file)
        : await api.user.deleteCoverPhoto();

      // Update local state
      setProfile({
        ...profile,
        cover_photo_url: newProfile.cover_photo_url,
      });

      alert("Cover photo updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      alert("Failed to update cover photo. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const renderCoverPhotoForm = () => {
    if (!profile) return null;

    return (
      <div>
        <strong>Cover Photo:</strong>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          {profile.cover_photo_url && (
            <div>
              <img
                src={profile.cover_photo_url}
                alt="Cover"
                style={{
                  maxWidth: "100px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
              <button onClick={() => handleCoverPhotoUpload(null)}>
                Delete
              </button>
            </div>
          )}
          <label
            htmlFor="cover-photo-upload"
            style={{
              display: "inline-block",
              padding: "8px 15px",
              background: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Upload Profile Picture
          </label>
          <input
            id="cover-photo-upload"
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>
    );
  };

  const handleResumeUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | null
  ) => {
    if (!profile) return;
    if (e && (!e.target.files || e.target.files.length === 0)) return;

    const file = e ? e.target.files![0] : null;
    try {
      setSaveLoading(true);

      const newProfile = file
        ? await api.user.uploadResume(file)
        : await api.user.deleteResume();

      // Update local state
      setProfile({
        ...profile,
        resume_url: newProfile.resume_url,
      });

      alert("Resume uploaded successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      alert("Failed to upload resume. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const renderResumeForm = () => {
    if (!profile) return null;

    return (
      <div>
        <strong>Resume:</strong>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          {profile.resume_url && (
            <div>
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                View Resume
              </a>
              <button onClick={() => handleResumeUpload(null)}>Delete</button>
            </div>
          )}
          <label
            htmlFor="resume-upload"
            style={{
              display: "inline-block",
              padding: "8px 15px",
              background: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Upload Resume
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (error) {
    return (
      <div style={{ color: "red" }}>
        <h3>Error loading profile</h3>
        <p>{error}</p>
        <p>Please make sure you are logged in to view your profile.</p>
      </div>
    );
  }

  if (!profile) {
    return <div>No profile information available.</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>

      <Accordion>
        {/* Basic Info */}
        <AccordionItem title="Basic Information" defaultOpen={true}>
          {renderEditButtons("basicInfo")}

          {editSection === "basicInfo" ? (
            renderBasicInfoForm()
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div>
                <strong>User ID:</strong> {profile.user_id}
              </div>
              <div>
                <strong>First Name:</strong> {profile.first_name}
              </div>
              <div>
                <strong>Last Name:</strong> {profile.last_name}
              </div>
              {profile.additional_name && (
                <div>
                  <strong>Additional Name:</strong> {profile.additional_name}
                </div>
              )}
              {profile.name_pronunciation && (
                <div>
                  <strong>Name Pronunciation:</strong>{" "}
                  {profile.name_pronunciation}
                </div>
              )}
              {profile.industry && (
                <div>
                  <strong>Industry:</strong> {profile.industry}
                </div>
              )}
              {profile.location && (
                <div>
                  <strong>Location:</strong> {profile.location}
                </div>
              )}
              {profile.bio && (
                <div>
                  <strong>Bio:</strong> {profile.bio}
                </div>
              )}
              {profile.website && (
                <div>
                  <strong>Website:</strong>{" "}
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
              <div>
                <strong>Created:</strong>{" "}
                {new Date(profile.created_at).toLocaleDateString()}
              </div>
              <div>
                <strong>Updated:</strong>{" "}
                {new Date(profile.updated_at).toLocaleDateString()}
              </div>
            </div>
          )}
        </AccordionItem>

        {/* Contact Info */}
        {(profile.contact_info || editSection === "contactInfo") && (
          <AccordionItem title="Contact Information">
            {renderEditButtons("contactInfo")}

            {editSection === "contactInfo" ? (
              renderContactInfoForm()
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                {profile.contact_info && (
                  <>
                    <div>
                      <strong>Email:</strong> {profile.contact_info.email}
                    </div>
                    {profile.contact_info.phone && (
                      <div>
                        <strong>Phone:</strong> {profile.contact_info.phone} (
                        {profile.contact_info.phone_type})
                      </div>
                    )}
                    {profile.contact_info.address && (
                      <div>
                        <strong>Address:</strong> {profile.contact_info.address}
                      </div>
                    )}
                    {profile.contact_info.birthday && (
                      <div>
                        <strong>Birthday:</strong>{" "}
                        {new Date(
                          profile.contact_info.birthday
                        ).toLocaleDateString()}
                      </div>
                    )}
                    {profile.contact_info.profile_url && (
                      <div>
                        <strong>Profile URL:</strong>{" "}
                        <a
                          href={profile.contact_info.profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {profile.contact_info.profile_url}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </AccordionItem>
        )}

        {/* Education */}
        <AccordionItem title={`Education (${profile.education?.length || 0})`}>
          {renderEditButtons("education")}

          {editSection === "education" ? (
            renderEducationForm()
          ) : (
            <>
              {profile.education && profile.education.length > 0 ? (
                profile.education.map((edu: Education) => (
                  <div
                    key={edu.id}
                    style={{
                      marginBottom: "15px",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <h4>{edu.school}</h4>
                    <div>
                      <strong>Degree:</strong> {edu.degree}
                    </div>
                    <div>
                      <strong>Field of Study:</strong> {edu.field_of_study}
                    </div>
                    <div>
                      <strong>Period:</strong>{" "}
                      {new Date(edu.start_date).getFullYear()} -{" "}
                      {edu.end_date
                        ? new Date(edu.end_date).getFullYear()
                        : "Present"}
                    </div>
                  </div>
                ))
              ) : (
                <div>No education information available.</div>
              )}
            </>
          )}
        </AccordionItem>

        {/* Experience */}
        <AccordionItem
          title={`Experience (${profile.experience?.length || 0})`}
        >
          {renderEditButtons("experience")}

          {editSection === "experience" ? (
            renderExperienceForm()
          ) : (
            <>
              {profile.experience && profile.experience.length > 0 ? (
                profile.experience.map((exp: Experience) => (
                  <div
                    key={exp.id}
                    style={{
                      marginBottom: "15px",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <h4>
                      {exp.position} at {exp.company}
                    </h4>
                    <div>
                      <strong>Period:</strong>{" "}
                      {new Date(exp.start_date).toLocaleDateString()} -{" "}
                      {exp.end_date
                        ? new Date(exp.end_date).toLocaleDateString()
                        : "Present"}
                    </div>
                    {exp.description && (
                      <div>
                        <strong>Description:</strong> {exp.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>No experience information available.</div>
              )}
            </>
          )}
        </AccordionItem>

        {/* Projects */}
        <AccordionItem title={`Projects (${profile.projects?.length || 0})`}>
          {renderEditButtons("projects")}

          {editSection === "projects" ? (
            renderProjectsForm()
          ) : (
            <>
              {profile.projects && profile.projects.length > 0 ? (
                profile.projects.map((project: Project) => (
                  <div
                    key={project.id}
                    style={{
                      marginBottom: "15px",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <h4>{project.name}</h4>
                    <div>
                      <strong>Description:</strong> {project.description}
                    </div>
                    <div>
                      <strong>Period:</strong>{" "}
                      {new Date(project.start_date).toLocaleDateString()} -{" "}
                      {project.end_date
                        ? new Date(project.end_date).toLocaleDateString()
                        : "Present"}
                    </div>
                    {project.url && (
                      <div>
                        <strong>URL:</strong>{" "}
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.url}
                        </a>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>No project information available.</div>
              )}
            </>
          )}
        </AccordionItem>

        {/* Courses */}
        <AccordionItem title={`Courses (${profile.courses?.length || 0})`}>
          {renderEditButtons("courses")}

          {editSection === "courses" ? (
            renderCoursesForm()
          ) : (
            <>
              {profile.courses && profile.courses.length > 0 ? (
                profile.courses.map((course: Course) => (
                  <div
                    key={course.id}
                    style={{
                      marginBottom: "15px",
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <h4>{course.name}</h4>
                    <div>
                      <strong>Provider:</strong> {course.provider}
                    </div>
                    {course.completion_date && (
                      <div>
                        <strong>Completed:</strong>{" "}
                        {new Date(course.completion_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>No course information available.</div>
              )}
            </>
          )}
        </AccordionItem>

        {/* Skills */}
        <AccordionItem title={`Skills (${profile.skills?.length || 0})`}>
          {renderEditButtons("skills")}

          {editSection === "skills" ? (
            renderSkillsForm()
          ) : (
            <>
              {profile.skills && profile.skills.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {profile.skills.map((skill: Skill) => (
                    <div
                      key={skill.id}
                      style={{
                        background: "#f0f0f0",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        fontSize: "14px",
                      }}
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              ) : (
                <div>No skills available.</div>
              )}
            </>
          )}
        </AccordionItem>

        {/* Interests */}
        <AccordionItem title={`Interests (${profile.interests?.length || 0})`}>
          {renderEditButtons("interests")}

          {editSection === "interests" ? (
            renderInterestsForm()
          ) : (
            <>
              {profile.interests && profile.interests.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {profile.interests.map((interest: Interest) => (
                    <div
                      key={interest.id}
                      style={{
                        background: "#f0f8ff",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        fontSize: "14px",
                      }}
                    >
                      {interest.name}
                    </div>
                  ))}
                </div>
              ) : (
                <div>No interests available.</div>
              )}
            </>
          )}
        </AccordionItem>

        {/* Additional Media */}
        <AccordionItem title="Media & Documents">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {renderResumeForm()}
            {renderProfilePictureForm()}
            {renderCoverPhotoForm()}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
