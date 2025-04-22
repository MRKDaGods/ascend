'use client';
import React from 'react';
import {
  Card,
  Typography,
  Box,
  Avatar,
  Chip,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

export type JobStatus = 'Saved' | 'In Progress' | 'Applied' | 'Archived' | 'Posted';
export type ApplicationStatus = 'Pending' | 'Viewed' | 'Rejected' | 'Accepted';

interface JobCardProps {
  job_id: number;
  title: string;
  description: string;
  industry: string;
  type: string;
  experience_level: string;
  location: string;
  workplace_type: string;
  salary_min_range: number | null;
  salary_max_range: number | null;
  company_id: number;
  company_name: string;
  company_logo_url: string | null;
  saved_at: Date;
  applicationStatus?: ApplicationStatus;
  status?: JobStatus;
  onDelete: (job_id: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job_id,
  title,
  company_name,
  location,
  type,
  saved_at,
  company_logo_url,
  applicationStatus,
  status,
  onDelete,
}) => {
  const router = useRouter();

  const appStatus: ApplicationStatus | null =
    status === 'Applied' ? applicationStatus ?? 'Pending' : null;

  const handleClick = () => {
    const queryParams = new URLSearchParams({
      id: job_id.toString(),
      title,
      company: company_name,
      location,
      type,
      description: '',
      about: '',
      requirements: '',
    });

    router.push(`/apply?${queryParams.toString()}`);
  };

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

  const formattedDate = saved_at
    ? new Date(saved_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        p: 3,
        transition: '0.25s ease-in-out',
        '&:hover': {
          boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar
          src={company_logo_url || ''}
          alt={company_name}
          variant="rounded"
          sx={{ width: 64, height: 64 }}
        />

        <Box flexGrow={1}>
          <Typography variant="h6" fontWeight={600} color="#0a66c2">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {company_name} • {location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {type}
          </Typography>
        </Box>

        <Stack spacing={1} alignItems="flex-end">
          {status && (
            <Tooltip title={`Status: ${status}`}>
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
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  px: 2,
                }}
              />
            </Tooltip>
          )}
          {appStatus && (
            <Chip
              label={appStatus}
              color={getApplicationStatusColor(appStatus)}
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderRadius: '999px',
                fontSize: '0.75rem',
                px: 2,
              }}
            />
          )}
        </Stack>
      </Box>

      {formattedDate && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Typography variant="caption" color="text.secondary">
            Saved on {formattedDate}
          </Typography>
        </Box>
      )}

      <Box display="flex" justifyContent="flex-end" mt={1}>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onDelete(job_id);
          }}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default JobCard;
