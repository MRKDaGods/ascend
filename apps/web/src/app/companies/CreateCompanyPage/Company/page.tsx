'use client';

import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CompanyForm from '@/app/components/CompanyForm';
import CompanyPreview from '@/app/components/CompanyPreview';
import BackButton from '@/app/components/BackButton';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';
import Navbar from '@/app/components/Navbar';

const CreateCompanyPage = () => {
  const theme = useTheme();
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
    <Box sx={{ 
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      color: theme.palette.text.primary 
    }}>
      <Navbar />
      <Box p={4}>
        <Box
          display="flex"
          alignItems="center"
          sx={{
            bgcolor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            padding: '10px 20px',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          <BackButton />
          <Typography 
            variant="h6" 
            ml={1}
            sx={{ color: theme.palette.text.primary }}
          >
            Let's get started with a few details about your company.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ pt: 8 }}>
          <Grid item xs={12} md={6}>
            <CompanyForm />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography 
              variant="subtitle1" 
              mb={1}
              sx={{ color: theme.palette.text.secondary }}
            >
              Page preview
            </Typography>
            <CompanyPreview formData={formData} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CreateCompanyPage;