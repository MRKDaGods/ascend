'use client';

import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CompanyForm from '@/app/components/CompanyForm';
import CompanyPreview from '@/app/components/CompanyPreview';
import BackButton from '@/app/components/BackButton';

const CreateCompanyPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    website: '',
    industry: '',
    size: '',
    type: '',
    tagline: '',
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (logo) {
      const url = URL.createObjectURL(logo);
      setLogoUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [logo]);

  return (
    <Box p={4} sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}> {/* Ensure full page height */}
      {/* White bar at the very top */}
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
          zIndex: 1000,  // Keep it on top of other content
        }}
      >
        <BackButton />
        <Typography variant="h6" ml={1}>
          Let’s get started with a few details about your company.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ pt: 8 }}> {/* Add padding top to push content below the bar */}
        <Grid item xs={12} md={6}> {/* 50% width on medium screens and above */}
          <CompanyForm
            formData={formData}
            setFormData={setFormData}
            setLogo={setLogo}
          />
        </Grid>
        <Grid item xs={12} md={6}> {/* 50% width on medium screens and above */}
          <Typography variant="subtitle1" mb={1}>
            Page preview
          </Typography>
          <CompanyPreview formData={formData} logoUrl={logoUrl} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateCompanyPage;
