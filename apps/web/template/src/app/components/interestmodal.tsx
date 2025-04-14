'use client';

import React, { useState } from 'react';

// Types
export type Interest = {
  name: string;
};

// Props
type InterestsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Interest[]) => void;
};

const InterestsModal: React.FC<InterestsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [interestsForm, setInterestsForm] = useState<Interest[]>([]);

  const handleAddInterest = () => {
    const newInterest: Partial<Interest> = { name: '' };
    setInterestsForm([...interestsForm, newInterest as Interest]);
  };

  const handleUpdateInterest = (index: number, value: string) => {
    const updatedInterests = [...interestsForm];
    updatedInterests[index] = { ...updatedInterests[index], name: value };
    setInterestsForm(updatedInterests);
  };

  const handleRemoveInterest = (index: number) => {
    const updatedInterests = [...interestsForm];
    updatedInterests.splice(index, 1);
    setInterestsForm(updatedInterests);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(interestsForm);
    setInterestsForm([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} id="interests-modal-overlay">
      <div style={modalStyle} id="interests-modal">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 20 }} id="interests-modal-title">Manage Interests</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 24 }}
            id="interests-modal-close-button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} id="interests-form">
          {interestsForm.map((interest, index) => (
            <div
              key={index}
              style={{
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #eee',
                display: 'flex',
                alignItems: 'center',
              }}
              id={`interest-item-${index}`}
            >
              <input
                type="text"
                id={`interest-input-${index}`}
                value={interest.name || ''}
                onChange={(e) => handleUpdateInterest(index, e.target.value)}
                placeholder="Interest name"
                style={{ flex: 1, padding: '8px', marginRight: '10px' }}
              />
              <button
                type="button"
                onClick={() => handleRemoveInterest(index)}
                style={{
                  color: 'red',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
                id={`remove-interest-button-${index}`}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddInterest}
            style={{
              padding: '8px 15px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
            id="add-interest-button"
          >
            Add Interest
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
            id="save-interests-button"
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
  width: 500,
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

export default InterestsModal;
