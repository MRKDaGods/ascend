'use client';

import React from 'react';
import { Box, Typography, Button, Paper, Avatar } from '@mui/material';
import { useCompanyStore } from '@/app/stores/useCompanyStore';

type Props = {
  formData: any;
};

const CompanyPreview = ({ formData }: Props) => {
  const { profileImage } = useCompanyStore();  // Get the profileImage from Zustand

  console.log('FormData in Preview:', formData);  // Debugging line to check if formData is correct

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        width: 450,
        bgcolor: '#eee',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box
        sx={{
          p: 2,
          width: '90%',
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Avatar
          src={profileImage || '/Company.png'}  // Use profileImage from Zustand store
          sx={{ width: 80, height: 80, mb: 2 }}
        />
        <Typography variant="h6">{formData.name || 'Company name'}</Typography>
        <Typography variant="body2">{formData.description || 'Description'}</Typography>
        <Typography variant="body2" color="text.secondary">{formData.industry || 'Industry'}</Typography>
        <Typography variant="body2" color="text.secondary">{formData.location || 'Location'}</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          + Follow
        </Button>
      </Box>
    </Paper>
  );
};

export default CompanyPreview;
