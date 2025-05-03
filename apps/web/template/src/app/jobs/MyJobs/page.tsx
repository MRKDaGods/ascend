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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import JobTabs from '@/app/components/JobTabs';
import JobCard from '@/app/components/JobCard';
import { useJobStore } from '@/app/stores/useJobStore';
import MergeJobsNavbar from '@/app/components/MergeJobsNavbar';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const MyJobsPage = () => {
  const theme = useTheme(); // Access the current theme
  const { activeTab, jobs, fetchSavedJobs, fetchAppliedJobs, deleteJob, fetchPostedJobs } = useJobStore();
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  useEffect(() => {
    setHasMounted(true);
    fetchSavedJobs();
    fetchAppliedJobs(); // Fetch applied jobs when component mounts
    fetchPostedJobs(1);
  }, [fetchSavedJobs, fetchAppliedJobs, fetchPostedJobs]);

  // Add this effect to debug tab changes
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
    console.log('Jobs for this tab:', jobs.filter(job => job.status === activeTab));
  }, [activeTab, jobs]);

  // Reset the company filter when tab changes
  useEffect(() => {
    setSelectedCompanyId('');
  }, [activeTab]);

  if (!hasMounted) return null;

  // Get unique companies from posted jobs
  const getUniqueCompanies = () => {
    const postedJobs = jobs.filter(job => job.status === 'Posted');
    const uniqueCompanies = Array.from(
      new Map(postedJobs.map(job => [job.company_id, { id: job.company_id, name: job.company_name }])).values()
    );
    return uniqueCompanies;
  };

  const uniqueCompanies = getUniqueCompanies();

  // Filter jobs by tab AND company (if on Posted tab and company selected)
  const filteredJobs = jobs.filter((job) => {
    const matchesTab = job.status === activeTab;

    // Apply company filter only when in Posted tab and a company is selected
    if (activeTab === 'Posted' && selectedCompanyId) {
      return matchesTab && job.company_id.toString() === selectedCompanyId;
    }

    return matchesTab;
  });

  // Handle company filter change
  const handleCompanyFilterChange = (event: SelectChangeEvent) => {
    setSelectedCompanyId(event.target.value as string);
  };

  return (
    <>
      <MergeJobsNavbar />

      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
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
              color: theme.palette.text.primary,
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
              backgroundColor: theme.palette.background.default,
              mb: 4,
              borderBottom: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              borderRadius: 2,
            }}
          >
            <JobTabs />
          </Box>

          {/* Company Filter - Only show in Posted tab */}
          {activeTab === 'Posted' && uniqueCompanies.length > 0 && (
            <Paper 
              elevation={1}
              sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <FilterAltIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={500}>
                  Filter by company:
                </Typography>
              </Box>
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: 200, 
                  flex: 1,
                  maxWidth: { sm: '60%' } 
                }}
              >
                <Select
                  value={selectedCompanyId}
                  onChange={handleCompanyFilterChange}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Companies</MenuItem>
                  {uniqueCompanies.map((company) => (
                    <MenuItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {selectedCompanyId && (
                <Chip 
                  label="Clear filter" 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  onDelete={() => setSelectedCompanyId('')}
                  sx={{ ml: 'auto' }}
                />
              )}
            </Paper>
          )}

          {/* Job Cards Section */}
          <Stack spacing={3}>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Box key={`job-${job.job_id}`}>  {/* Added unique key prop */}
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
                    created_at={job.created_at}
                    company_description={job.company_description}
                    company_industry={job.company_industry}
                    company_location={job.company_location}
                  />
                </Box>
              ))
            ) : (
              <Paper
                elevation={1}
                sx={{
                  py: 6,
                  px: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.secondary,
                }}
              >
                <WorkOutlineIcon
                  sx={{ fontSize: 56, mb: 2, color: theme.palette.primary.light }}
                />
                <Typography variant="h6" gutterBottom>
                  No jobs found in this tab
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeTab === 'Posted' && selectedCompanyId 
                    ? "No jobs found for the selected company."
                    : "Your saved or applied jobs will appear here. Explore jobs to start saving or applying."}
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