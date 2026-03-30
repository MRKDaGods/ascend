'use client';

import { Box, useTheme } from '@mui/material';
import JobForm from '../../components/JobForm';
import MergeJobsNavbar from '@/app/components/MergeJobsNavbar';

export default function JobPostingPage() {
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
        <JobForm />
      </Box>
    </>
  );
}
