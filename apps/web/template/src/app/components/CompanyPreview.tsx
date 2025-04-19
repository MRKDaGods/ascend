'use client';

import React from 'react';
import { Box, Typography, Button, Paper, Avatar } from '@mui/material';

type Props = {
  formData: any;
  logoUrl: string | null;
};

const CompanyPreview = ({ formData, logoUrl }: Props) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        width: 450,
        bgcolor: '#eee',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Shift everything to the left
        mt: { xs: 4, md: 0 },
      }}
    >
      <Box
        sx={{
          p: 2,
          width: '90%', // Make the white box smaller
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Avatar
          src={logoUrl || '/Company.png'}
          sx={{ width: 80, height: 80, mb: 2 }}
        />
        <Typography variant="h6">{formData.name || 'Company name'}</Typography>
        <Typography variant="body2">{formData.tagline || 'Tagline'}</Typography>
        <Typography variant="body2" color="text.secondary">
          {formData.industry || 'Industry'}
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          + Follow
        </Button>
      </Box>
    </Paper>
  );
};

export default CompanyPreview;
