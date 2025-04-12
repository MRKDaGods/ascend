'use client';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';

export type JobStatus = 'Saved' | 'In Progress' | 'Applied' | 'Archived';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  status: JobStatus;
  logo?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  type,
  status,
  logo,
}) => {
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: 2,
        p: 2,
        transition: '0.3s ease',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar
          src={logo}
          alt={company}
          sx={{ width: 60, height: 60, mr: 2 }}
        />
        <Box flexGrow={1}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: '#0a66c2' }}
          >
            {title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {company}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {location} • {type}
          </Typography>
        </Box>

        <Stack alignItems="flex-end" spacing={1}>
          <Chip
            label={status}
            color={
              status === 'Saved'
                ? 'default'
                : status === 'In Progress'
                ? 'info'
                : status === 'Applied'
                ? 'warning'
                : 'success'
            }
            variant="outlined"
            sx={{
              fontWeight: 600,
              borderRadius: '8px',
              fontSize: '0.75rem',
              px: 1,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Posted 2 days ago
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
};

export default JobCard;
