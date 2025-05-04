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
import { useTheme } from '@mui/material/styles';
import { useJobFilterStore } from '../stores/useJobFilterStore';

const experienceLevels = ['Internship', 'Entry', 'Associate', 'Mid', 'Director'];
const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Creative'];
const locations = ['New York', 'San Francisco', 'London', 'Egypt'];
const workplaceTypes = ['Remote', 'On-site', 'Hybrid'];

export default function JobFilter() {
  const theme = useTheme();

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

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
      backgroundColor: 'transparent',
      border: 'none',
      '& fieldset': {
        borderColor: theme.palette.divider,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiInputBase-input': {
      padding: '10px 14px',
      color: theme.palette.text.primary,
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
    },
  };

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, mb: 2, backgroundColor: 'transparent' }}>
      <Grid container spacing={2}>
        {/* Keyword */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Keyword"
            value={keyword}
            onChange={(e) => setFilter('keyword', e.target.value)}
            fullWidth
            sx={textFieldStyle}
            size="small"
          />
        </Grid>

        {/* Location */}
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            freeSolo
            options={locations}
            value={location}
            inputValue={location}
            onInputChange={(e, value) =>
              setFilter('location', value.replace(/[^\w\s,-]/g, ''))
            }
            onChange={(e, value) =>
              setFilter('location', value ? value.replace(/[^\w\s,-]/g, '') : '')
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location"
                placeholder="Enter locations (e.g. Cairo, Dubai)"
                helperText="For multiple locations, use commas"
                sx={textFieldStyle}
                size="small"
              />
            )}
            componentsProps={{
              paper: {
                sx: {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                },
              },
            }}
          />
        </Grid>

        {/* Industry */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Industry"
            value={industry}
            onChange={(e) => setFilter('industry', e.target.value)}
            fullWidth
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
            sx={textFieldStyle}
            size="small"
          />
        </Grid>

        {/* Workplace Type */}
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            options={workplaceTypes}
            value={workplace_type}
            onChange={(e, value) => setFilter('workplace_type', value || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Workplace Type"
                sx={textFieldStyle}
                size="small"
              />
            )}
            componentsProps={{
              paper: {
                sx: {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                },
              },
            }}
          />
        </Grid>

        {/* Salary Min */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Minimum Salary"
            type="number"
            value={salary_range_min || ''}
            onChange={(e) =>
              setFilter('salary_range_min', e.target.value === '' ? 0 : parseInt(e.target.value))
            }
            fullWidth
            sx={textFieldStyle}
            size="small"
          />
        </Grid>

        {/* Salary Max */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Maximum Salary"
            type="number"
            value={salary_range_max || ''}
            onChange={(e) =>
              setFilter('salary_range_max', e.target.value === '' ? 0 : parseInt(e.target.value))
            }
            fullWidth
            sx={textFieldStyle}
            size="small"
          />
        </Grid>

        {/* Experience Level */}
        <Grid item xs={12}>
          <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
            <Typography variant="body2" fontWeight={600}>
              Experience:
            </Typography>
            {experienceLevels.map((level) => (
              <FormControlLabel
                key={level}
                control={
                  <Checkbox
                    checked={experience_level.includes(level)}
                    onChange={() => handleExperienceChange(level)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">{level}</Typography>}
              />
            ))}
          </Box>
        </Grid>

        {/* Reset Button */}
        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={resetFilters}
              variant="outlined"
              startIcon={<ResetIcon />}
              sx={{ borderRadius: '20px' }}
              size="small"
            >
              Reset Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
