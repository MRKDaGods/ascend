'use client';
import React from 'react';
import {
  Card,
  Typography,
  Box,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';

export type JobStatus = 'Saved' | 'In Progress' | 'Applied' | 'Archived';
export type ApplicationStatus = 'Pending' | 'Viewed' | 'Rejected' | 'Accepted';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  status: JobStatus;
  logo?: string;
  applicationStatus?: ApplicationStatus;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  type,
  status,
  logo,
  applicationStatus,
}) => {
  const appStatus: ApplicationStatus | null =
    status === 'Applied' ? applicationStatus ?? 'Pending' : null;

  const getApplicationStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Pending':
        return 'default';
      case 'Viewed':
        return 'info';
      case 'Rejected':
        return 'error';
      case 'Accepted':
        return 'success';
      default:
        return 'default';
    }
  };

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
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={logo}
          alt={company}
          sx={{ width: 60, height: 60 }}
        />
        <Box flexGrow={1}>
          <Typography variant="h6" fontWeight={600} color="#0a66c2">
            {title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {company}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {location} • {type}
          </Typography>
        </Box>

        <Stack spacing={0.5} alignItems="flex-end">
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
              px: 1.5,
            }}
          />

          {appStatus !== null && (
            <Chip
              label={appStatus}
              color={getApplicationStatusColor(appStatus)}
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderRadius: '8px',
                fontSize: '0.75rem',
                px: 1.5,
              }}
            />
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default JobCard;
