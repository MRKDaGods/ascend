'use client';
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import JobTabs from './components/JobTabs';
import JobCard from './components/JobCard';
import { useJobStore } from '@/app/shared/store/useJobStore';

// ✅ Adjust Job type to match the structure from useJobStore
interface Job {
  job_id: number;
  title: string;
  description: string;
  industry: string;
  type: string;
  experience_level: string;
  location: string;
  workplace_type: string;
  salary_min_range: number | null;
  salary_max_range: number | null;
  company_id: number;
  company_name: string;
  company_logo_url: string | null;
  saved_at: Date; // Optional since it's not present in useJobStore
  status?: string; // Optional since it's not present in useJobStore
}

const MyJobsPage = () => {
  const { activeTab, jobs, fetchSavedJobs } = useJobStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetchSavedJobs();         // Uncomment when integrating with backend
  }, [fetchSavedJobs]);

  if (!hasMounted) return null;

  //  Adjust filter logic to handle missing status property
  const filteredJobs = jobs.filter((job: Job) => job.status === activeTab);
console.log('jobs', jobs);
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
              key={job.job_id} // ✅ Add a unique key for each JobCard
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
              company_logo_url={job.company_logo_url ?? null} // Handle null values for logo
              saved_at={job.saved_at}
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
