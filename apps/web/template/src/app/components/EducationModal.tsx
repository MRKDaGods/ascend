'use client';
import React, { useState, useEffect } from 'react';

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
    school: '',
    degree: '',
    field: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    description: ''
  });

  // Fetch data from Mockoon when modal opens
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/education"); // Ensure Mockoon is running
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Education Data:", data);

        if (Array.isArray(data) && data.length > 0) {
          setEducation(data[0]); // Using the first education object
        } else {
          console.warn("No education data found.");
        }
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    };

    if (isOpen) {
      fetchEducation();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEducation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(education);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0 }}>Add Education</h3>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <label>School*</label>
        <input
          name="school"
          value={education.school}
          onChange={handleChange}
          placeholder="Ex: Cairo University"
          style={styles.input}
        />

        <label>Degree*</label>
        <input
          name="degree"
          value={education.degree}
          onChange={handleChange}
          placeholder="Ex: Bachelor's in Engineering"
          style={styles.input}
        />

        <label>Field of Study</label>
        <input
          name="field"
          value={education.field}
          onChange={handleChange}
          placeholder="Ex: Business"
          style={styles.input}
        />

        <div style={styles.dateGroup}>
          <div style={styles.dateFields}>
            <label>Start Date</label>
            <select name="startMonth" value={education.startMonth} onChange={handleChange} style={styles.input}>
              <option value="">Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={(i + 1).toString()}>
                  {new Date(0, i).toLocaleString('en', { month: 'long' })}
                </option>
              ))}
            </select>
            <select name="startYear" value={education.startYear} onChange={handleChange} style={styles.input}>
              <option value="">Year</option>
              {[...Array(20)].map((_, i) => (
                <option key={i} value={(2025 - i).toString()}>
                  {2025 - i}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.dateFields}>
            <label>End Date (or expected)</label>
            <select name="endMonth" value={education.endMonth} onChange={handleChange} style={styles.input}>
              <option value="">Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={(i + 1).toString()}>
                  {new Date(0, i).toLocaleString('en', { month: 'long' })}
                </option>
              ))}
            </select>
            <select name="endYear" value={education.endYear} onChange={handleChange} style={styles.input}>
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
        <textarea
          name="description"
          value={education.description}
          onChange={handleChange}
          style={styles.textarea}
        ></textarea>

        <button style={styles.saveButton} onClick={handleSubmit}>
          Save
        </button>
        <button style={styles.closeButtonText} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

// Styles remain unchanged
const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    background: 'white',
    padding: '20px',
    width: '500px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer'
  },
  closeButtonText: {
    marginTop: 10,
    background: 'none',
    border: '1px solid #ccc',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  input: {
    width: '100%',
    marginTop: '6px',
    marginBottom: '12px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  dateGroup: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px'
  },
  dateFields: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  textarea: {
    width: '100%',
    height: '80px',
    marginTop: '10px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  saveButton: {
    background: '#0073b1',
    color: 'white',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px'
  }
};

export default EducationModal;
