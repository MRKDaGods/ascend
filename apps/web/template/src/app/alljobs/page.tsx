'use client';
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import FilterSidebar from './components/FilterSidebar';
import AllJobList from './components/AllJobList';
import { useJobFilterStore } from './store/useJobFilterStore';

const AllJobsPage = () => {
  const { setJobs } = useJobFilterStore();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Prevent SSR mismatch
    setIsMounted(true);

    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [setJobs]);

  if (!isMounted) return null; // or a loader if you'd like

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: 'black' }}>
        All Jobs
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <FilterSidebar />
        </Grid>
        <Grid item xs={12} md={9}>
          <AllJobList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllJobsPage;
