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
import { usepJobStore } from "../stores/usepJobStore";
import { useIsClient } from "../hooks/useIsClient";
import CompanyEmailModal from "./CompanyEmailModal";
import PostJobPopUp from "../components/PostPopUp";
import { useJobStore as useSharedJobStore } from "../stores/useJobStore";
import { Job } from "../stores/useJobStore";
import API from "@/api/api";

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

// Add type for API error
interface APIError {
  response?: {
    status: number;
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
}

const JobForm = () => {
  const [openModal, setOpenModal] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setErrorMessage("");
    
    // Ensure company_id is not null
    if (!companyId) {
      setErrorMessage("Company ID is required");
      setIsSubmitting(false);
      return;
    }
    
    const jobData = {
      title,
      description,
      industry,
      type: jobType,
      experience_level: experienceLevel,
      location,
      workplace_type: workplaceType,
      salary_min_range: salaryMin ? Number(salaryMin) : undefined, // Changed from null to undefined
      salary_max_range: salaryMax ? Number(salaryMax) : undefined, // Changed from null to undefined
      email: verifiedEmail,
      company: companyName,
      company_id: companyId, // Now guaranteed to be a number
      logo: "",
      about: "",
      requirements: [] as string[], // Explicitly type the array
    };

    try {
      const response = await API.post("/job", jobData);
      
      if (!response.data) {
        throw new Error("Failed to post job - no data returned");
      }

      const data = response.data;
      const fullJob: Job = { // Explicitly type as Job
        ...jobData,
        job_id: data.id || data.job_id,
        status: "Posted" as const,
        saved_at: new Date(),
        company_name: companyName,
        company_logo_url: "",
        company_id: companyId, // Guaranteed to be a number
        // Convert undefined to null for salary ranges
        salary_min_range: salaryMin ? Number(salaryMin) : null,
        salary_max_range: salaryMax ? Number(salaryMax) : null,
        // Add missing required properties from Job interface
        title: jobData.title,
        description: jobData.description,
        industry: jobData.industry,
        type: jobData.type,
        experience_level: jobData.experience_level,
        location: jobData.location,
        workplace_type: jobData.workplace_type,
      };

      // Update local job posting store
      setPostedJob(fullJob);
      setPostedJobId(data.id || data.job_id);
      setSavedJobPopupOpen(true);
      
      // Also add to the shared job store
      addPostedJobToSharedStore(fullJob);
      
      // Clear the form
      resetForm();
      
      setOpenModal(false);
    } catch (error: unknown) { // Explicitly type the error
      console.error("Failed to post job:", error);
      
      let message = "Failed to post job.";
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as APIError;
        message = `Error (${apiError.response?.status}): ${
          apiError.response?.data?.error || 
          apiError.response?.data?.message || 
          message
        }`;
      } else if (error instanceof Error) {
        message = error.message;
      }
      
      setErrorMessage(message);
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIndustry('');
    setJobType('');
    setExperienceLevel('');
    setLocation('');
    setWorkplaceType('');
    setSalaryMin('');
    setSalaryMax('');
    setVerifiedEmail('');
    setErrorMessage('');
  };

  const isClient = useIsClient();
  if (!isClient) return null;

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: "auto", mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Job details</Typography>
        </Box>

        {errorMessage && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Job title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              data-testid="job-form-title"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company"
              fullWidth
              value={companyName}
              disabled={true}
              margin="normal"
              data-testid="job-form-company"
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#000000",
                  opacity: 0.8,
                },
                "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                }
              }}
              helperText="Company name cannot be edited"
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
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" required>
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
            <FormControl fullWidth margin="normal" required>
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
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" required>
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
            rows={10}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add your responsibilities, requirements, and details..."
            margin="normal"
            data-testid="job-form-description"
            required
            sx={{
              '& .MuiInputBase-root': {
                minHeight: '250px', 
              },
              '& .MuiOutlinedInput-input': {
                fontSize: '1rem',    
                lineHeight: '1.6', 
              }
            }}
          />
          <Typography variant="caption" color="text.secondary">{description.length}/10,000</Typography>
        </Box>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setOpenModal(true)} 
            data-testid="job-form-post-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
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