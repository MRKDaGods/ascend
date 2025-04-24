'use client';
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import FilterSidebar from './components/FilterSidebar';
import AllJobList from './components/AllJobList';
import { useJobFilterStore } from './store/useJobFilterStore';
import { fetchJobs } from '../lib/api';

const AllJobsPage = () => {
  const { setJobs } = useJobFilterStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  
    const load = async () => {
      try {
        const res = await fetchJobs(1, 100);
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
  
    load();
  }, [setJobs]);
  
  if (!isMounted) return null;

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
