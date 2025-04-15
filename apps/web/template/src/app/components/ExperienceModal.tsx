'use client';

import React, { useState } from 'react';

type Experience = {
  company: string;
  position: string;
  description: string;
  start_date: Date;
  end_date?: Date;
};

type ExperienceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Experience[]) => void;
};

const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onClose, onSave }) => {
  const [experienceForm, setExperienceForm] = useState<Experience[]>([]);

  const handleAddExperience = () => {
    const newExperience: Partial<Experience> = {
      company: '',
      position: '',
      description: '',
      start_date: new Date(),
    };
    setExperienceForm([...experienceForm, newExperience as Experience]);
  };

  const handleUpdateExperience = (index: number, field: keyof Experience, value: any) => {
    const updatedExperience = [...experienceForm];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setExperienceForm(updatedExperience);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperience = [...experienceForm];
    updatedExperience.splice(index, 1);
    setExperienceForm(updatedExperience);
  };

  const handleSubmit = () => {
    onSave(experienceForm);
    setExperienceForm([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} id="experience-modal-overlay">
      <div style={modalStyle} id="experience-modal">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 20 }} id="experience-modal-title">Manage Experiences</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 24 }}
            id="experience-modal-close-button"
          >
            ×
          </button>
        </div>

        {experienceForm.map((exp, index) => (
          <div
            key={index}
            style={{
              marginBottom: '20px',
              padding: '10px',
              border: '1px solid #eee',
            }}
            id={`experience-item-${index}`}
          >
            <input
              type="text"
              placeholder="Company name"
              value={exp.company}
              onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              id={`company-input-${index}`}
            />
            <button
              onClick={() => handleRemoveExperience(index)}
              style={{
                color: 'red',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              id={`remove-experience-button-${index}`}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={handleAddExperience}
          style={{
            padding: '8px 15px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
          id="add-experience-button"
        >
          Add Experience
        </button>

        <button
          onClick={handleSubmit}
          style={{
            marginTop: '20px',
            background: '#0073b1',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          id="save-experience-button"
        >
          Save All
        </button>
      </div>
    </div>
  );
};

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  background: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  padding: 24,
  borderRadius: 10,
  width: 600,
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

export default ExperienceModal;