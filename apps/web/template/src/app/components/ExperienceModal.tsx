'use client';

import React, { useState } from 'react';

// Define the Experience type
export type Experience = {
  company: string;
  position: string;
  description?: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  start_date?: Date;
  end_date?: Date;
  location?: string;
  employmentType?: string;
  currentlyWorking?: boolean;
};

// Types
interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Experience[]) => void;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 50 }, (_, i) => `${new Date().getFullYear() - i}`);

const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onClose, onSave }) => {
  const [experience, setExperience] = useState<Experience>({
    company: '',
    position: '',
    description: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    location: '',
    employmentType: '',
    currentlyWorking: false,
  });

  const handleChange = (field: keyof Experience, value: any) => {
    setExperience((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedExperience: Experience = {
      ...experience,
      start_date: new Date(`${experience.startMonth} ${experience.startYear}`),
      end_date: experience.currentlyWorking
        ? undefined
        : new Date(`${experience.endMonth} ${experience.endYear}`),
    };

    onSave([formattedExperience]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>Add experience</h2>
          <button style={closeButtonStyle} onClick={onClose}>×</button>
        </div>

        <div style={notifyStyle}>
          <div>
            <strong>Notify network</strong>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
              Turn on to notify your network of key profile changes (such as new job) and work anniversaries.
            </p>
          </div>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Title*</label>
            <input
              type="text"
              placeholder="Ex: Retail Sales Manager"
              value={experience.position}
              onChange={(e) => handleChange('position', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Employment type</label>
            <select
              value={experience.employmentType}
              onChange={(e) => handleChange('employmentType', e.target.value)}
              style={inputStyle}
            >
              <option value="">Please select</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Apprenticeship">Apprenticeship</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Company*</label>
            <input
              type="text"
              placeholder="Ex: Microsoft"
              value={experience.company}
              onChange={(e) => handleChange('company', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ ...formGroupStyle, display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              checked={experience.currentlyWorking}
              onChange={(e) => handleChange('currentlyWorking', e.target.checked)}
            />
            <span style={{ fontSize: '14px' }}>I am currently working in this role</span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Start date*</label>
              <select
                value={experience.startMonth}
                onChange={(e) => handleChange('startMonth', e.target.value)}
                style={inputStyle}
              >
                <option value="">Month</option>
                {months.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>&nbsp;</label>
              <select
                value={experience.startYear}
                onChange={(e) => handleChange('startYear', e.target.value)}
                style={inputStyle}
              >
                <option value="">Year</option>
                {years.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {!experience.currentlyWorking && (
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>End date*</label>
                <select
                  value={experience.endMonth}
                  onChange={(e) => handleChange('endMonth', e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Month</option>
                  {months.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>&nbsp;</label>
                <select
                  value={experience.endYear}
                  onChange={(e) => handleChange('endYear', e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Year</option>
                  {years.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
          )}

          <div style={formGroupStyle}>
            <label style={labelStyle}>Location</label>
            <input
              type="text"
              placeholder="Ex: London, United Kingdom"
              value={experience.location}
              onChange={(e) => handleChange('location', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <button type="submit" style={saveButtonStyle}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 10,
  width: '95%',
  maxWidth: 600,
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: 24,
  fontFamily: 'Arial, sans-serif',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: 24,
  cursor: 'pointer',
};

const notifyStyle: React.CSSProperties = {
  backgroundColor: '#f3f6f8',
  borderRadius: 6,
  padding: '16px',
  marginBottom: 24,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  fontSize: 14,
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: 14,
};

const saveButtonStyle: React.CSSProperties = {
  backgroundColor: '#0a66c2',
  color: '#fff',
  border: 'none',
  padding: '12px 24px',
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 30,
  cursor: 'pointer',
};

export default ExperienceModal;