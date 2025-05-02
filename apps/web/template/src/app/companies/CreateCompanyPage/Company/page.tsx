// company/page.tsx
'use client';

import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CompanyForm from '@/app/components/CompanyForm';
import CompanyPreview from '@/app/components/CompanyPreview';
import BackButton from '@/app/components/BackButton';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';
import Navbar from '@/app/components/Navbar';

const CreateCompanyPage = () => {
  const [profileImage, setLogo] = useState<File | null>(null);

  const {
    name, industry, location, description,
  } = useCompanyStore();

  const formData = {
    name,
    industry,
    location,
    description,
  };

  return (
    <>
    <Navbar />
    <Box p={4} sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Box
        display="flex"
        alignItems="center"
        sx={{
          bgcolor: 'white',
          padding: '10px 20px',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <BackButton />
        <Typography variant="h6" ml={1}>
          Let’s get started with a few details about your company.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ pt: 8 }}>
        <Grid item xs={12} md={6}>
          {/* No props needed here */}
          <CompanyForm />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" mb={1}>
            Page preview
          </Typography>
          <CompanyPreview formData={formData} />
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default CreateCompanyPage;
