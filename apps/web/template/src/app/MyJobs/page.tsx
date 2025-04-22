'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Fade,
  Stack,
  Paper,
  useTheme,
} from '@mui/material';
import JobTabs from './components/JobTabs';
import JobCard from './components/JobCard';
import { useJobStore } from '@/app/shared/store/useJobStore';
import Navbar from '../components/navbar';   // add the navbar without the 2 searches when integrating with the deployed version
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const MyJobsPage = () => {
  const theme = useTheme();
  const { activeTab, jobs, fetchSavedJobs, deleteJob } = useJobStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  if (!hasMounted) return null;

  const filteredJobs = jobs.filter((job) => job.status === activeTab);

  return (
    <>
      <Navbar />

      <Box
        sx={{
          background: 'linear-gradient(to bottom, #f4f6f8, #ffffff)',
          minHeight: '100vh',
          pt: { xs: 10, sm: 12 },
          pb: 6,
        }}
      >
        <Container maxWidth="md">
          {/* Hero Section */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 5,
              mb: 5,
              textAlign: 'center',
              background: theme.palette.background.paper,
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              color="primary.main"
              gutterBottom
            >
              My Jobs
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 480, mx: 'auto' }}
            >
              View, manage, and keep track of your saved, applied, and posted jobs easily in one place.
            </Typography>
          </Paper>

          {/* Sticky Tabs */}
          <Box
            sx={{
              position: 'sticky',
              top: { xs: 56, sm: 64 },
              zIndex: 10,
              backgroundColor: '#f9fafb',
              mb: 4,
              borderBottom: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              borderRadius: 2,
            }}
          >
            <JobTabs />
          </Box>

          {/* Job Cards Section */}
          <Stack spacing={3}>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <Fade in timeout={400 + index * 75} key={job.job_id}>
                  <Box>
                    <JobCard
                      job_id={job.job_id}
                      title={job.title}
                      description={job.description}
                      industry={job.industry}
                      type={job.type}
                      experience_level={job.experience_level}
                      location={job.location}
                      workplace_type={job.workplace_type}
                      salary_min_range={job.salary_min_range}
                      salary_max_range={job.salary_max_range}
                      company_id={job.company_id}
                      company_name={job.company_name}
                      company_logo_url={job.company_logo_url ?? null}
                      saved_at={job.saved_at}
                      status={job.status}
                      applicationStatus={job.applicationStatus}
                      onDelete={deleteJob}
                    />
                  </Box>
                </Fade>
              ))
            ) : (
              <Paper
                elevation={1}
                sx={{
                  py: 6,
                  px: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  backgroundColor: '#fff',
                }}
              >
                <WorkOutlineIcon
                  sx={{ fontSize: 56, mb: 2, color: 'primary.light' }}
                />
                <Typography variant="h6" gutterBottom>
                  No jobs found in this tab
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your saved or applied jobs will appear here. Explore jobs to start saving or applying.
                </Typography>
              </Paper>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default MyJobsPage;
