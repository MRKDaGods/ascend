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
import { usepJobStore } from "../stores/usepJobStore";
import { useIsClient } from "../hooks/useIsClient";
import CompanyEmailModal from "./CompanyEmailModal";
import PostJobPopUp from "../components/PostPopUp";
import { useJobStore as useSharedJobStore } from "@/app/stores/useJobStore";

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
const experienceOptions = ["Internship", "Entry", "Associate", "MID", "Director"];

const JobForm = () => {
  const [openModal, setOpenModal] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const {
    title,
    companyName,
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
      company_id: 1,
      email: verifiedEmail,
      company: companyName,
      logo: "",
      about: "",
      requirements: [],
    };

    try {
      const res = await fetch("https://api.ascendx.tech/job", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
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
      console.error("❌ Error posting job:", err);
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
            <TextField fullWidth label="Job title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Experience Level" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
              {experienceOptions.map((level) => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Workplace type" value={workplaceType} onChange={(e) => setWorkplaceType(e.target.value)}>
              {workplaceOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Job location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Job type" value={jobType} onChange={(e) => setJobType(e.target.value)}>
              {jobTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth type="number" label="Min Salary" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth type="number" label="Max Salary" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} />
          </Grid>
        </Grid>

        <Box mt={5}>
          <Typography variant="h6" gutterBottom>Job description</Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add your responsibilities, requirements, and details..."
            sx={{ mt: 2 }}
          />
          <Typography variant="caption" color="text.secondary">{description.length}/10,000</Typography>
        </Box>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (!title || !companyName || !description) {
                alert("Title, company name, and description are required.");
              } else if (!verifiedEmail) {
                setOpenModal(true);
              } else {
                postJob();
              }
            }}
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
