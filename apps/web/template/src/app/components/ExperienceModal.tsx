'use client';

import React, { useState, useEffect } from 'react';

// Type definitions

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
    jobTitle: '',
    company: '',
    employmentType: '',
    startMonth: '',
    startYear: '',
    endMonth: '',
    endYear: '',
    location: '',
    locationType: '',
    isCurrentlyWorking: false,
    description: ''
  });

  const [jobData, setJobData] = useState<JobData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3002/experience')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then((data: JobData[]) => setJobData(data))
        .catch((error) => {
          console.error('Error fetching job data:', error);
          setError('Failed to load job data');
        });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      jobTitle: '',
      company: '',
      employmentType: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      location: '',
      locationType: '',
      isCurrentlyWorking: false,
      description: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          background: 'white',
          padding: 20,
          width: 500,
          borderRadius: 10,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Add Experience</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Title*</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Ex: Software Engineer"
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Employment Type</label>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Please select</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <label style={labelStyle}>Company or Organization*</label>
          <select name="company" value={formData.company} onChange={handleChange} style={inputStyle}>
            <option value="">Please select</option>
            {jobData.length > 0 ? (
              jobData.map((job) => (
                <option key={job.id} value={job.company}>
                  {job.company}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {error || 'Loading...'}
              </option>
            )}
          </select>

          <label style={labelStyle}>Start Date*</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select name="startMonth" value={formData.startMonth} onChange={handleChange} style={inputStyle}>
              <option>Month</option>
              {[
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select name="startYear" value={formData.startYear} onChange={handleChange} style={inputStyle}>
              <option>Year</option>
              {Array.from({ length: 30 }, (_, i) => (
                <option key={i} value={(new Date().getFullYear() - i).toString()}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>

          <label style={labelStyle}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your role and responsibilities"
            style={{ ...inputStyle, height: '80px' }}
          />

          <button
            type="submit"
            style={{
              background: '#0073b1',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  marginTop: '5px',
  border: '1px solid #ccc',
  borderRadius: '5px'
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 'bold',
  marginTop: '10px',
  display: 'block'
};

export default ExperienceModal;