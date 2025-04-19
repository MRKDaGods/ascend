'use client';
import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Divider,
} from '@mui/material';
import { useJobFilterStore } from '../store/useJobFilterStore';

const experienceLevels = ['Entry', 'Mid', 'Senior'];
const salaryRanges = ['0-5000', '5000-10000', '10000-20000', '20000+'];

const FilterSidebar = () => {
  const [uniqueCompanies, setUniqueCompanies] = useState<string[]>([]);
  const { filters, setFilter } = useJobFilterStore();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs');
        const data = await response.json();
        const jobs = data as { company: string }[];
        const companies = Array.from(new Set(jobs.map((job) => job.company)));
        setUniqueCompanies(companies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const toggleCheckbox = (key: keyof typeof filters, value: string) => {
    const current = filters[key].split(',').filter(Boolean);
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilter(key, updated.join(','));
  };

  return (
    <div style={{ padding: '1rem', width: 250 }}>
      <Typography variant="h6" gutterBottom style={{ color: 'black' }}>
        Filter by Company
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <FormGroup>
        {uniqueCompanies.map((company) => (
          <FormControlLabel
            key={company}
            control={
              <Checkbox
                checked={filters.company.split(',').includes(company)}
                onChange={() => toggleCheckbox('company', company)}
                sx={{ color: 'black' }}
              />
            }
            label={<span style={{ color: 'black' }}>{company}</span>}
          />
        ))}
      </FormGroup>

      <Typography variant="h6" gutterBottom style={{ color: 'black', marginTop: '1.5rem' }}>
        Filter by Experience
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <FormGroup>
        {experienceLevels.map((level) => (
          <FormControlLabel
            key={level}
            control={
              <Checkbox
                checked={filters.experienceLevel.split(',').includes(level)}
                onChange={() => toggleCheckbox('experienceLevel', level)}
                sx={{ color: 'black' }}
              />
            }
            label={<span style={{ color: 'black' }}>{level}</span>}
          />
        ))}
      </FormGroup>

      <Typography variant="h6" gutterBottom style={{ color: 'black', marginTop: '1.5rem' }}>
        Filter by Salary
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <FormGroup>
        {salaryRanges.map((range) => (
          <FormControlLabel
            key={range}
            control={
              <Checkbox
                checked={filters.salary.split(',').includes(range)}
                onChange={() => toggleCheckbox('salary', range)}
                sx={{ color: 'black' }}
              />
            }
            label={<span style={{ color: 'black' }}>{range}</span>}
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default FilterSidebar;
