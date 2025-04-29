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
import { useJobFilterStore } from '../store/useJobFilterStore';

// Constants for dropdown options
const experienceLevels = ['Internship', 'Entry', 'Associate', 'Mid', 'Director'];
const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Creative'];
const locations = ['New York', 'San Francisco', 'London'];
const workplaceTypes = ['Remote', 'On-site', 'Hybrid'];

// Style for text fields to make them rounded
const textFieldStyle = {
  backgroundColor: 'white',
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
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
        p: 2,
        borderRadius: 3,
        mb: 2,
        backgroundColor: '#f9fafb',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Grid container spacing={2}>
        {/* Keyword */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Keyword"
            value={keyword}
            onChange={(e) => setFilter('keyword', e.target.value)}
            fullWidth
            margin="normal"
            data-testid="job-filter-keyword"
          />
        </Grid>

        {/* Location */}
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            options={locations}
            value={location}
            onChange={(e, newValue) => setFilter('location', newValue || '')}
            renderInput={(params) => <TextField {...params} label="Location" margin="normal" />}
            data-testid="job-filter-location"
          />
        </Grid>

        {/* Industry */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Industry"
            value={industry}
            onChange={(e) => setFilter('industry', e.target.value)}
            fullWidth
            margin="normal"
            data-testid="job-filter-industry"
          />
        </Grid>

        {/* Company */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Company"
            value={company}
            onChange={(e) => setFilter('company', e.target.value)}
            fullWidth
            margin="normal"
            data-testid="job-filter-company"
          />
        </Grid>

        {/* Workplace Type */}
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            options={workplaceTypes}
            value={workplace_type}
            onChange={(e, newValue) => setFilter('workplace_type', newValue || '')}
            renderInput={(params) => <TextField {...params} label="Workplace Type" margin="normal" />}
            data-testid="job-filter-workplace-type"
          />
        </Grid>

        {/* Experience Level */}
        <Grid item xs={12} md={12}>
          <Typography gutterBottom fontWeight={600} fontSize="0.95rem">
            Experience Level
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {experienceLevels.map((level) => (
              <FormControlLabel
                key={level}
                control={
                  <Checkbox
                    size="small"
                    checked={experience_level.includes(level)}
                    onChange={() => handleExperienceChange(level)}
                    data-testid={`job-filter-exp-${level.toLowerCase()}`}
                  />
                }
                label={level}
                sx={{ m: 0 }}
              />
            ))}
          </Box>
        </Grid>

        {/* Salary Range */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Minimum Salary"
            type="number"
            value={salary_range_min || ''}
            onChange={(e) => setFilter('salary_range_min', e.target.value === '' ? 0 : parseInt(e.target.value))}
            fullWidth
            margin="normal"
            data-testid="job-filter-salary-min"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Maximum Salary"
            type="number"
            value={salary_range_max || ''}
            onChange={(e) => setFilter('salary_range_max', e.target.value === '' ? 0 : parseInt(e.target.value))}
            fullWidth
            margin="normal"
            data-testid="job-filter-salary-max"
          />
        </Grid>

        {/* Reset Button */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="flex-end">
            <Button 
              onClick={resetFilters} 
              variant="outlined" 
              color="primary"
              data-testid="job-filter-reset-button"
            >
              Reset Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
