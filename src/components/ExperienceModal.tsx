import React, { useState, useEffect } from "react";
import "./ExperienceModal.css";

type ExperienceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExperienceData) => void;
};

type ExperienceData = {
  jobTitle: string;
  company: string;
  employmentType: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  location: string;
  locationType: string;
  isCurrentlyWorking: boolean;
  description: string;
};

type JobData = {
  id: number;
  company: string;
};

const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ExperienceData>({
    jobTitle: "",
    company: "",
    employmentType: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    location: "",
    locationType: "",
    isCurrentlyWorking: false,
    description: "",
  });

  const [jobData, setJobData] = useState<JobData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:3002/experience")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          return response.json();
        })
        .then((data: JobData[]) => setJobData(data))
        .catch((error) => {
          console.error("Error fetching job data:", error);
          setError("Failed to load job data");
        });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      jobTitle: "",
      company: "",
      employmentType: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      location: "",
      locationType: "",
      isCurrentlyWorking: false,
      description: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Experience</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Title*</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Ex: Software Engineer"
            required
          />

          <label>Employment Type</label>
          <select name="employmentType" value={formData.employmentType} onChange={handleChange}>
            <option value="">Please select</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <label>Company or Organization*</label>
          <select name="company" value={formData.company} onChange={handleChange}>
            <option value="">Please select</option>
            {jobData.length > 0 ? (
              jobData.map((job) => (
                <option key={job.id} value={job.company}>
                  {job.company}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {error || "Loading..."}
              </option>
            )}
          </select>

          <label>Start Date*</label>
          <div className="date-container">
            <select name="startMonth" value={formData.startMonth} onChange={handleChange}>
              <option>Month</option>
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select name="startYear" value={formData.startYear} onChange={handleChange}>
              <option>Year</option>
              {Array.from({ length: 30 }, (_, i) => (
                <option key={i} value={(new Date().getFullYear() - i).toString()}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your role and responsibilities"
          />

          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default ExperienceModal;