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
    updated_at: new Date(),
  });

  const [educationList, setEducationList] = useState<Education[]>([]);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  useEffect(() => {
    if (isOpen && editingEducation) {
      setEducation({
        ...editingEducation,
        start_date: new Date(editingEducation.start_date),
        end_date: editingEducation.end_date ? new Date(editingEducation.end_date).toISOString() : undefined,
      });
    } else if (isOpen) {
      setEducation({
        id: 0,
        user_id: 0,
        school: '',
        degree: '',
        field_of_study: '',
        start_date: new Date(),
        end_date: undefined,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }, [isOpen, editingEducation]);

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
    setEditingEducation(null); // Reset editing state
  };

  if (!isOpen) return null;

  const formatDateForInput = (date?: Date | string): string => {
    if (!date) return '';
    const parsedDate = new Date(date);

    // Check if date is valid
    if (isNaN(parsedDate.getTime())) return '';

    return parsedDate.toISOString().split('T')[0];
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0 }}>{editingEducation ? 'Edit Education' : 'Add Education'}</h3>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        {/* Education List */}
        <div style={styles.educationList}>
          <h4>Existing Education Entries</h4>
          {educationList.length > 0 ? (
            <div>
              {educationList.map((edu) => (
                <div
                  key={edu.id}
                  style={{
                    borderBottom: '1px solid #ddd',
                    padding: '16px 0',
                  }}
                >
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{edu.school}</h4>
                  <p style={{ margin: '0', color: '#666' }}>
                    {edu.degree} • {edu.field_of_study}
                  </p>
                  <p style={{ margin: '4px 0', color: '#888', fontSize: '14px' }}>
                    {new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} -{' '}
                    {edu.end_date
                      ? new Date(edu.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                      : 'Present'}
                  </p>
                  <button
                    style={styles.editButton}
                    onClick={() => {
                      setEditingEducation(edu);
                      onClose();
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No education entries found.</p>
          )}
        </div>

        {/* Add/Edit Education Form */}
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

// Add styles for the edit button
const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(14, 12, 12, 0.3)',
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
  },
  educationList: {
    marginBottom: '20px'
  },
  list: {
    listStyleType: 'none',
    padding: 0
  },
  listItem: {
    marginBottom: '10px',
    padding: '10px',
    background: '#f9f9f9',
    borderRadius: '5px'
  },
  editButton: {
    marginTop: '10px',
    background: '#0073b1',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default EducationModal;

