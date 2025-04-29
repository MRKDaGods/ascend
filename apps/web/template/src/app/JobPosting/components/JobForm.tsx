"use client";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useState } from "react";
import { usepJobStore } from "../store/usepJobStore";
import { useIsClient } from "../hooks/useIsClient";
import CompanyEmailModal from "./CompanyEmailModal";
import PostJobPopUp from "../components/PostPopUp";
import { useJobStore as useSharedJobStore } from "@/app/shared/store/useJobStore";

const workplaceOptions = ["On-site", "Remote", "Hybrid"];
const jobTypeOptions = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Volunteer",
  "Internship",
  "Other",
];
const experienceOptions = ["Internship", "Entry", "Associate", "Mid", "Director"];

const JobForm = () => {
  const [openModal, setOpenModal] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const {
    title,
    companyName,
    companyId,
    location,
    description,
    workplaceType,
    jobType,
    industry,
    experienceLevel,
    salaryMin,
    salaryMax,
    setTitle,
    setCompanyName,
    setLocation,
    setDescription,
    setWorkplaceType,
    setJobType,
    setIndustry,
    setExperienceLevel,
    setSalaryMin,
    setSalaryMax,
    setSavedJobPopupOpen,
    setPostedJobId,
    setPostedJob,
  } = usepJobStore();

  const { postJob: addPostedJobToSharedStore } = useSharedJobStore();

  const postJob = async () => {
    const jobData = {
      title,
      description,
      industry,
      type: jobType,
      experience_level: experienceLevel,
      location,
      workplace_type: workplaceType,
      salary_min_range: salaryMin ? Number(salaryMin) : null,
      salary_max_range: salaryMax ? Number(salaryMax) : null,
      email: verifiedEmail,
      company: companyName,
      company_id: companyId,
      logo: "",
      about: "",
      requirements: [],
    };

    try {
      const res = await fetch("https://api.ascendx.tech/job", {
        method: "POST",
        headers: { "Content-Type": "application/json" , 
        Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0NTk1MzI2OCwiZXhwIjoxNzQ1OTk2NDY4fQ.qbls-HS1EPXglqpymZ_13YtIdzma3E4USsxgeVuNa1o',

    },
        body: JSON.stringify(jobData),
      });

      if (!res.ok) throw new Error("Failed to post job");

      const data = await res.json();
      const fullJob = {
        ...jobData,
        id: data.id,
        status: "Posted" as const,
      };

      setPostedJob(fullJob);
      setPostedJobId(data.id);
      setSavedJobPopupOpen(true);
      setOpenModal(false);
    } catch (err) {
      alert("Failed to post job.");
    }
  };

  const isClient = useIsClient();
  if (!isClient) return null;

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: "auto", mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Job details</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Job title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              data-testid="job-form-title"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company"
              fullWidth
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              margin="normal"
              data-testid="job-form-company"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Industry"
              fullWidth
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              margin="normal"
              data-testid="job-form-industry"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Experience Level</InputLabel>
              <Select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                label="Experience Level"
                data-testid="job-form-experience-level"
              >
                {experienceOptions.map((level) => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Workplace type</InputLabel>
              <Select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                label="Workplace Type"
                data-testid="job-form-workplace-type"
              >
                {workplaceOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Job location"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              margin="normal"
              data-testid="job-form-location"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Job Type</InputLabel>
              <Select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                label="Job Type"
                data-testid="job-form-job-type"
              >
                {jobTypeOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Min Salary"
              type="number"
              fullWidth
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              margin="normal"
              data-testid="job-form-salary-min"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Max Salary"
              type="number"
              fullWidth
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              margin="normal"
              data-testid="job-form-salary-max"
            />
          </Grid>
        </Grid>

        <Box mt={5}>
          <Typography variant="h6" gutterBottom>Job description</Typography>
          <TextField
            label="Description"
            multiline
            rows={6}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add your responsibilities, requirements, and details..."
            margin="normal"
            data-testid="job-form-description"
          />
          <Typography variant="caption" color="text.secondary">{description.length}/10,000</Typography>
        </Box>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={postJob}
            data-testid="job-form-post-button"
          >
            Post
          </Button>
        </Box>
      </Paper>

      {openModal && (
        <CompanyEmailModal
          companyName={companyName}
          onClose={() => setOpenModal(false)}
          onVerify={(email) => {
            setVerifiedEmail(email);
            postJob();
          }}
        />
      )}

      <PostJobPopUp />
    </>
  );
};

export default JobForm;
