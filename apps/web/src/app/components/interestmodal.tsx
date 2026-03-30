'use client';

import React, { useState } from 'react';

export type Interest = {
  id?: number;
  name: string;
  isFollowing?: boolean;
  logoUrl?: string;
  followers?: number;
};

type InterestsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Interest[]) => void;
  profile: {
    interests?: Interest[];
  };
};

const InterestsModal: React.FC<InterestsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profile,
}) => {
  const [interestsForm, setInterestsForm] = useState<Interest[]>(profile?.interests || []);
  const [editMode, setEditMode] = useState(false);

  const handleAddInterest = () => {
    setInterestsForm((prev) => [...prev, { name: '', isFollowing: false }]);
    setEditMode(true);
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...interestsForm];
    updated[index].name = value;
    setInterestsForm(updated);
  };

  const handleRemove = (index: number) => {
    const updated = [...interestsForm];
    updated.splice(index, 1);
    setInterestsForm(updated);
  };

  const handleSubmit = () => {
    const updated = interestsForm.map((item, i) => ({
      ...item,
      id: item.id ?? Date.now() + i,
    }));
    onSave(updated);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>Add interests</h2>
          <button onClick={onClose} style={closeBtnStyle}>×</button>
        </div>

        {interestsForm.map((interest, index) => (
          <div key={index} style={interestCard}>
            <input
              value={interest.name}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="Enter an interest"
              style={inputStyle}
            />
            <button onClick={() => handleRemove(index)} style={removeBtnStyle}>
              Delete
            </button>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <button onClick={handleAddInterest} style={addBtnStyle}>+ Add interest</button>
          <button onClick={handleSubmit} style={saveBtnStyle}>Save</button>
        </div>
      </div>
    </div>
  );
};

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: '100vw',
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  width: '100%',
  maxWidth: 600,
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 0 20px rgba(0,0,0,0.15)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
};

const closeBtnStyle: React.CSSProperties = {
  fontSize: 28,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
};

const interestCard: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 16px',
  border: '1px solid #ddd',
  borderRadius: 12,
  marginBottom: 10,
  gap: 12,
  backgroundColor: '#f8f9fa',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #ccc',
  fontSize: 14,
};

const removeBtnStyle: React.CSSProperties = {
  background: 'none',
  color: '#d93025',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
};

const addBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 24,
  backgroundColor: '#0073b1',
  color: '#fff',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
};

const saveBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 24,
  backgroundColor: '#e2e2e2',
  color: '#000',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
};

export default InterestsModal;
