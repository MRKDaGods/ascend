'use client';
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import JobTabs from './components/JobTabs';
import JobCard, { JobStatus } from './components/JobCard';
import { useJobStore } from '@/app/shared/store/useJobStore';

interface Job {
  title: string;
  company: string;
  location: string;
  type: string;
  status: JobStatus;
  logo?: string;
}

const validStatuses = ['Saved', 'In Progress', 'Applied', 'Archived'] as const;

const isValidStatus = (status: string): status is JobStatus =>
  validStatuses.includes(status as JobStatus);

const MyJobsPage = () => {
  const { activeTab, jobs, fetchSavedJobs } = useJobStore(); // added fetchSavedJobs
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // fetchSavedJobs();         // Uncomment when integrating with backend
  }, [fetchSavedJobs]);

  if (!hasMounted) return null;

  const filteredJobs = jobs.filter((job: Job) =>
    isValidStatus(job.status) ? job.status === activeTab : false
  );

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
