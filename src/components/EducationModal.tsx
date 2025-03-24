import React, { useState } from "react";
import "./EducationModal.css";

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

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (education: Education) => void;
}

const EducationModal: React.FC<EducationModalProps> = ({ isOpen, onClose, onSave }) => {
  const [education, setEducation] = useState<Education>({
    school: "",
    degree: "",
    field: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEducation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(education);
  };

  if (!isOpen) return null;

  return (
    <div className="education-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add Education</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <label>School*</label>
        <input name="school" value={education.school} onChange={handleChange} placeholder="Ex: Cairo University" />

        <label>Degree*</label>
        <input name="degree" value={education.degree} onChange={handleChange} placeholder="Ex: Bachelor's in Engineering" />

        <label>Field of Study</label>
        <input name="field" value={education.field} onChange={handleChange} placeholder="Ex: Business" />

        <div className="date-group">
          <div className="date-fields">
            <label>Start Date</label>
            <select name="startMonth" value={education.startMonth} onChange={handleChange}>
              <option value="">Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={(i + 1).toString()}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
            <select name="startYear" value={education.startYear} onChange={handleChange}>
              <option value="">Year</option>
              {[...Array(20)].map((_, i) => (
                <option key={i} value={(2025 - i).toString()}>
                  {2025 - i}
                </option>
              ))}
            </select>
          </div>

          <div className="date-fields">
            <label>End Date (or expected)</label>
            <select name="endMonth" value={education.endMonth} onChange={handleChange}>
              <option value="">Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={(i + 1).toString()}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
            <select name="endYear" value={education.endYear} onChange={handleChange}>
              <option value="">Year</option>
              {[...Array(20)].map((_, i) => (
                <option key={i} value={(2010 + i).toString()}>
                  {2010 + i}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label>Description</label>
        <textarea name="description" value={education.description} onChange={handleChange}></textarea>

        <button className="save-button" onClick={handleSubmit}>Save</button>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EducationModal;