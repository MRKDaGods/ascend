'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import JobFilter from './components/JobFilter';
import { useJobFilterStore } from './store/useJobFilterStore';
import JobItem from './components/JobItem';
import { useHasHydrated } from '@/hooks/useHasHydrated';

const buildQuery = (filters: Record<string, any>) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) continue;
    query.append(key, Array.isArray(value) ? value.join(',') : value.toString());
  }
  return query.toString();
};

const cleanFilters = (filters: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(filters).filter(([key, value]) => {
      if (key === 'salary_range_min' || key === 'salary_range_max') {
        return value > 0;
      }
      return value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0);
    })
  );
};

export default function JobsPage() {
  const {
    keyword,
    location,
    industry,
    experience_level,
    company,
    workplace_type,
    salary_range_min,
    salary_range_max,
    jobs,
    setJobs,
  } = useJobFilterStore();

  const [loading, setLoading] = useState(true);
  const hasHydrated = useHasHydrated();

  const fetchJobs = async () => {
    setLoading(true);

    const filters = cleanFilters({
      keyword: keyword || undefined,
      location: location || undefined,
      industry: industry || undefined,
      experience_level: experience_level.length > 0 ? experience_level : undefined,
      company: company || undefined,
      workplace_type: workplace_type || undefined,
      salary_range_min: salary_range_min ?? 0,
      salary_range_max: salary_range_max ?? undefined,
      page: 1,
    });

    if (Object.keys(filters).length === 0) {
      setJobs([]);
      setLoading(false);
      return;
    }

    const url = `https://api.ascendx.tech/job/search?${buildQuery(filters)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        setJobs([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setJobs(data.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
      alert('Failed to fetch jobs. Please try again later.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [
    keyword,
    location,
    industry,
    experience_level,
    company,
    workplace_type,
    salary_range_min,
    salary_range_max,
    setJobs,
  ]);

  if (!hasHydrated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, md: 4 }} sx={{ backgroundColor: '#f3f6f9', minHeight: '100vh' }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 5,
          borderRadius: 4,
          backgroundColor: '#ffffff',
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{ color: '#1a237e', fontSize: { xs: '2rem', md: '2.8rem' } }}
        >
          Find Your Next Opportunity
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#5f6368', mb: 4, maxWidth: '600px' }}
        >
          Use filters to refine your search and discover opportunities tailored to your skills and preferences.
        </Typography>

        <JobFilter />
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress />
        </Box>
      ) : jobs && jobs.length > 0 ? (
        <Grid container spacing={4}>
          {jobs.map((job) => {
            const formattedJob = {
              job_id: job.job_id,
              title: job.title,
              company: job.company_name,
              location: job.location,
              type: job.type,
              description: job.description,
              experienceLevel: job.experience_level,
              salaryRange:
                job.salary_min_range != null && job.salary_max_range != null
                  ? `$${job.salary_min_range} - $${job.salary_max_range}`
                  : 'Not specified',
            };

            return (
              <Grid item xs={12} sm={6} md={4} key={job.job_id}>
                <JobItem {...formattedJob} />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box textAlign="center" mt={6}>
          <Typography variant="h6" color="text.secondary">
            No jobs found.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters to see more results.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
