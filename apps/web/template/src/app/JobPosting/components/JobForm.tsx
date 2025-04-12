"use client";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { useJobStore } from "../store/useJobStore";
import { useIsClient } from "../hooks/useIsClient";

const workplaceOptions = ["On-site", "Remote", "Hybrid"];
const jobTypeOptions = ["Full-time", "Part-time", "Contract", "Internship"];

const JobForm = () => {
  const {
    title,
    companyName,
    location,
    description,
    workplaceType,
    jobType,
    setTitle,
    setCompanyName,
    setLocation,
    setDescription,
    setWorkplaceType,
    setJobType,
  } = useJobStore();

  const isClient = useIsClient();
  if (!isClient) return null;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Job details</Typography>
        
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Job title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            InputProps={{
              
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Workplace type"
            value={workplaceType}
            onChange={(e) => setWorkplaceType(e.target.value)}
          >
            {workplaceOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Job location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Job type"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            {jobTypeOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Job description
        </Typography>
        <Typography variant="body2" gutterBottom color="text.secondary">
          This will be visible to anyone who views your job post.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add your responsibilities, requirements, and details..."
          sx={{ mt: 2 }}
        />
        <Typography variant="caption" color="text.secondary">
          {description.length}/10,000
        </Typography>
      </Box>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary">
          Post
        </Button>
      </Box>
    </Paper>
  );
};

export default JobForm;
