'use client';
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import JobTabs from './components/JobTabs';
import JobCard from './components/JobCard';
import { useJobStore } from '@/app/shared/store/useJobStore';

// ✅ Extend JobStatus inline
type JobStatus = 'Saved' | 'In Progress' | 'Applied' | 'Archived' | 'Posted';

interface Job {
  title: string;
  company: string;
  location: string;
  type: string;
  status: JobStatus;
  logo?: string;
}

const MyJobsPage = () => {
  const { activeTab, jobs, fetchSavedJobs } = useJobStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // fetchSavedJobs();         // Uncomment when integrating with backend
  }, [fetchSavedJobs]);

  if (!hasMounted) return null;

  const filteredJobs = jobs.filter((job: Job) => job.status === activeTab);

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'primary.main',
        }}
      >
        My Jobs
      </Typography>
      <Divider sx={{ mb: 4 }} />
      <JobTabs />

      <Box mt={4}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job: Job, index: number) => (
            <JobCard
              key={index}
              title={job.title}
              company={job.company}
              location={job.location}
              type={job.type}
              status={job.status}
              logo={job.logo}
            />
          ))
        ) : (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              mt: 4,
              fontStyle: 'italic',
            }}
          >
            No jobs found in this tab.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default MyJobsPage;
