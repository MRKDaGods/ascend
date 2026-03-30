'use client';

import React from 'react';
import { Box, useTheme } from '@mui/material';
import JobDetails from '../../components/JobDetail';
import MergeJobsNavbar from '../../components/MergeJobsNavbar';

export default function ApplyPage() {
  const theme = useTheme();

  return (
    <>
      <MergeJobsNavbar />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          pt: { xs: 8, sm: 10 },
          pb: 6,
        }}
      >
        <JobDetails />
      </Box>
    </>
  );
}
