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
            fullWidth
            variant="outlined"
            size="small"
            value={keyword}
            onChange={(e) => setFilter('keyword', e.target.value)}
            sx={textFieldStyle}
          />
        </Grid>

        {/* Location */}
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            freeSolo
            options={locations}
            value={location}
            onInputChange={(_, newValue) => setFilter('location', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location"
                variant="outlined"
                size="small"
                fullWidth
                sx={textFieldStyle}
              />
            )}
          />
        </Grid>

        {/* Industry */}
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            freeSolo
            options={industries}
            value={industry}
            onInputChange={(_, newValue) => setFilter('industry', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Industry"
                variant="outlined"
                size="small"
                fullWidth
                sx={textFieldStyle}
              />
            )}
          />
        </Grid>

        {/* Company */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Company"
            fullWidth
            variant="outlined"
            size="small"
            value={company}
            onChange={(e) => setFilter('company', e.target.value)}
            sx={textFieldStyle}
          />
        </Grid>

        {/* Workplace Type */}
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            freeSolo
            options={workplaceTypes}
            value={workplace_type}
            onInputChange={(_, newValue) => setFilter('workplace_type', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Workplace Type"
                variant="outlined"
                size="small"
                fullWidth
                sx={textFieldStyle}
              />
            )}
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
            fullWidth
            variant="outlined"
            type="number"
            size="small"
            value={salary_range_min || ''}
            onChange={(e) => setFilter('salary_range_min', Number(e.target.value) || 0)}
            sx={textFieldStyle}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Maximum Salary"
            fullWidth
            variant="outlined"
            type="number"
            size="small"
            value={salary_range_max || ''}
            onChange={(e) => setFilter('salary_range_max', Number(e.target.value) || 0)}
            sx={textFieldStyle}
          />
        </Grid>

        {/* Reset Button */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetFilters}
              startIcon={<ResetIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 20, // Make button rounded to match text fields
                px: 3,
              }}
            >
              Reset Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
