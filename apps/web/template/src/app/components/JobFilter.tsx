'use client';

import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Paper,
  Divider,
  Autocomplete,
} from '@mui/material';
import { RestartAlt as ResetIcon } from '@mui/icons-material';
import { useJobFilterStore } from '../stores/useJobFilterStore';

// Constants for dropdown options
const experienceLevels = ['Internship', 'Entry', 'Associate', 'Mid', 'Director'];
const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Creative'];
const locations = ['New York', 'San Francisco', 'London'];
const workplaceTypes = ['Remote', 'On-site', 'Hybrid'];

// Enhanced style for text fields to make them rounded and compact
const textFieldStyle = {
  backgroundColor: 'white',
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px', // Reduced padding for height
  },
  '& .MuiInputLabel-root': {
    transform: 'translate(14px, 12px) scale(1)', // Adjust label position
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -6px) scale(0.75)', // Adjust shrunk label position
  }
};

export default function JobFilter() {
  const {
    keyword,
    location,
    industry,
    company,
    workplace_type,
    experience_level,
    salary_range_min,
    salary_range_max,
    setFilter,
    resetFilters,
  } = useJobFilterStore();

  const handleExperienceChange = (level: string) => {
    const current = [...experience_level];
    const updated = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level];
    setFilter('experience_level', updated);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1.5, // Reduced padding
        borderRadius: 3,
        mb: 2,
        backgroundColor: '#f9fafb',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Grid container spacing={1.5}> {/* Reduced spacing */}
        {/* Keyword */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Keyword"
            value={keyword}
            onChange={(e) => setFilter('keyword', e.target.value)}
            fullWidth
            margin="dense" // Changed from normal to dense
            data-testid="job-filter-keyword"
            sx={textFieldStyle}
            size="small" // Added small size
          />
        </Grid>

        {/* Location */}
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            options={locations}
            value={location}
            onChange={(e, newValue) => setFilter('location', newValue || '')}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Location" 
                margin="dense" 
                sx={textFieldStyle}
                size="small"
              />
            )}
            data-testid="job-filter-location"
            size="small"
          />
        </Grid>

        {/* Industry */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Industry"
            value={industry}
            onChange={(e) => setFilter('industry', e.target.value)}
            fullWidth
            margin="dense"
            data-testid="job-filter-industry"
            sx={textFieldStyle}
            size="small"
          />
        </Grid>

        {/* Company */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Company"
            value={company}
            onChange={(e) => setFilter('company', e.target.value)}
            fullWidth
            margin="dense"
            data-testid="job-filter-company"
            sx={textFieldStyle}
            size="small"
          />
        </Grid>

        {/* Workplace Type */}
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            options={workplaceTypes}
            value={workplace_type}
            onChange={(e, newValue) => setFilter('workplace_type', newValue || '')}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Workplace Type" 
                margin="dense" 
                sx={textFieldStyle}
                size="small"
              />
            )}
            data-testid="job-filter-workplace-type"
            size="small"
          />
        </Grid>

        {/* Salary Range - Min */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Minimum Salary"
            type="number"
            value={salary_range_min || ''}
            onChange={(e) => setFilter('salary_range_min', e.target.value === '' ? 0 : parseInt(e.target.value))}
            fullWidth
            margin="dense"
            data-testid="job-filter-salary-min"
            sx={textFieldStyle}
            size="small"
          />
        </Grid>

        {/* Salary Range - Max */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Maximum Salary"
            type="number"
            value={salary_range_max || ''}
            onChange={(e) => setFilter('salary_range_max', e.target.value === '' ? 0 : parseInt(e.target.value))}
            fullWidth
            margin="dense"
            data-testid="job-filter-salary-max"
            sx={textFieldStyle}
            size="small"
          />
        </Grid>

        {/* Experience Level - Made more compact */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0, alignItems: 'center', mt: 0.5 }}>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, mr: 1 }}>
              Experience:
            </Typography>
            {experienceLevels.map((level) => (
              <FormControlLabel
                key={level}
                control={
                  <Checkbox
                    size="small"
                    checked={experience_level.includes(level)}
                    onChange={() => handleExperienceChange(level)}
                    data-testid={`job-filter-exp-${level.toLowerCase()}`}
                    sx={{ p: 0.5 }} // Reduced padding
                  />
                }
                label={<Typography variant="body2">{level}</Typography>}
                sx={{ m: 0, mr: 1 }}
              />
            ))}
          </Box>
        </Grid>

        {/* Reset Button */}
        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} /> {/* Reduced margin */}
          <Box display="flex" justifyContent="flex-end">
            <Button 
              onClick={resetFilters} 
              variant="outlined" 
              color="primary"
              data-testid="job-filter-reset-button"
              size="small" // Smaller button
              sx={{ borderRadius: '20px' }} // Rounded button
            >
              Reset Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
