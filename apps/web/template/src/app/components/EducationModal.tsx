'use client';
import { Education } from '@ascend/api-client/models';
import React, { useState, useEffect } from 'react';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (education: Education) => void;
}

const EducationModal: React.FC<EducationModalProps> = ({ isOpen, onClose, onSave }) => {
  const [education, setEducation] = useState<Education>({
    id: 0,
    user_id: 0,
    school: '',
    degree: '',
    field_of_study: '',
    start_date: new Date(),
    end_date: undefined,
    created_at: new Date(),
    updated_at: new Date()
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
          // Convert string dates to Date objects
          const formattedData = {
            ...data[0],
            start_date: data[0].start_date ? new Date(data[0].start_date) : new Date(),
            end_date: data[0].end_date ? new Date(data[0].end_date) : undefined,
            created_at: data[0].created_at ? new Date(data[0].created_at) : new Date(),
            updated_at: data[0].updated_at ? new Date(data[0].updated_at) : new Date()
          };
          setEducation(formattedData);
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

  const handleDateChange = (name: string, value: string) => {
    if (name === 'start_date') {
      setEducation((prev) => ({ ...prev, start_date: new Date(value) }));
    } else if (name === 'end_date') {
      setEducation((prev) => ({ ...prev, end_date: value || undefined }));
    }
  };

  const handleSubmit = () => {
    onSave(education);
  };

  if (!isOpen) return null;

  // Format dates for input fields
  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return date instanceof Date
      ? date.toISOString().split('T')[0]
      : new Date(date).toISOString().split('T')[0];
  };

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
          name="field_of_study"
          value={education.field_of_study}
          onChange={handleChange}
          placeholder="Ex: Business"
          style={styles.input}
        />

        <div style={styles.dateGroup}>
          <div style={styles.dateFields}>
            <label>Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formatDateForInput(education.start_date)}
              onChange={(e) => handleDateChange('start_date', e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.dateFields}>
            <label>End Date (or expected)</label>
            <input
              type="date"
              name="end_date"
              value={formatDateForInput(new Date(education.end_date || ''))}
              onChange={(e) => handleDateChange('end_date', e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        <label>Description</label>
        <textarea
          name="description"
          // value={education.description || ''}
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

