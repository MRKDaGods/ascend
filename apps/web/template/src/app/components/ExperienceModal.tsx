'use client';

import React, { useState } from 'react';

// Types
type ExperienceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Experience[]) => void;
};

type Experience = {
  company: string;
  position: string;
  description: string;
  start_date: Date;
  end_date?: Date;
};

const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onClose, onSave }) => {
  const [experienceForm, setExperienceForm] = useState<Experience[]>([]);

  // Handlers for Experience
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(experienceForm);
    setExperienceForm([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} data-testid="experience-modal">
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Manage Experiences</h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: 24 }}
            data-testid="close-modal-button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {experienceForm.map((exp, index) => (
            <div
              key={index}
              style={{
                marginBottom: '20px',
                padding: '10px',
                border: '1px solid #eee',
              }}
              data-testid={`experience-item-${index}`}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <h4>Experience #{index + 1}</h4>
                <button
                  onClick={() => handleRemoveExperience(index)}
                  style={{
                    color: 'red',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  data-testid={`remove-experience-${index}`}
                >
                  Remove
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                }}
              >
                <div>
                  <label>Company:</label>
                  <input
                    type="text"
                    value={exp.company || ''}
                    onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    data-testid={`company-input-${index}`}
                  />
                </div>
                <div>
                  <label>Position:</label>
                  <input
                    type="text"
                    value={exp.position || ''}
                    onChange={(e) => handleUpdateExperience(index, 'position', e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    data-testid={`position-input-${index}`}
                  />
                </div>
                <div style={{ gridColumn: '1 / span 2' }}>
                  <label>Description:</label>
                  <textarea
                    value={exp.description || ''}
                    onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginTop: '5px',
                      minHeight: '80px',
                    }}
                    data-testid={`description-input-${index}`}
                  />
                </div>
                <div>
                  <label>Start Date:</label>
                  <input
                    type="date"
                    value={
                      exp.start_date
                        ? (exp.start_date instanceof Date
                            ? exp.start_date.toISOString().split('T')[0]
                            : new Date(exp.start_date).toString() !== 'Invalid Date'
                              ? new Date(exp.start_date).toISOString().split('T')[0]
                              : '')
                        : ''
                    }
                    
                    onChange={(e) =>
                      handleUpdateExperience(index, 'start_date', new Date(e.target.value))
                    }
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    data-testid={`start-date-input-${index}`}
                  />
                </div>
                <div>
                  <label>End Date (leave empty if current):</label>
                  <input
                    type="date"
                    value={
                      exp.end_date instanceof Date
                        ? exp.end_date.toISOString().split('T')[0]
                        : exp.end_date
                        ? new Date(exp.end_date).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      handleUpdateExperience(
                        index,
                        'end_date',
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    data-testid={`end-date-input-${index}`}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
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
            data-testid="add-experience-button"
          >
            Add Experience
          </button>

          <button
            type="submit"
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
            data-testid="save-experiences-button"
          >
            Save All
          </button>
        </form>
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
  background: 'rgba(15, 14, 14, 0.3)',
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