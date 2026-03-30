'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  Snackbar,
  Alert,
  useTheme,
} from '@mui/material';
import MergeJobsNavbar from '@/app/components/MergeJobsNavbar';
import ApplicationCard from '@/app/components/ApplicationCard';
import API from '@/api/api';

interface Application {
  application_id: number;
  job_id: number;
  user_id: number;
  status: 'Pending' | 'Viewed' | 'Rejected' | 'Accepted';
  resume_url: string | null;
  created_at: string;
  email: string;
  phone: string;
  name?: string;
  profile_photo_url?: string;
}

interface ApiResponse {
  data: Application[];
  error: string | null;
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      error?: string;
      message?: string;
    };
  };
  message: string;
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as ApiError).response === 'object'
  );
}

const ApplicationsPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const jobId = params.jobId;
  const theme = useTheme();

  const jobTitle = searchParams.get('title') || '';
  const companyName = searchParams.get('company') || '';
  const jobLocation = searchParams.get('location') || '';

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        if (!jobTitle) {
          try {
            const jobResponse = await API.get(`/job/${jobId}`);
            if (jobResponse.data?.data) {
              setJobDetails(jobResponse.data.data);
            }
          } catch (err: unknown) {
            if (isApiError(err)) {
              console.error('Job detail error:', err.response?.data?.error);
            }
          }
        } else {
          setJobDetails({
            title: jobTitle,
            company_name: companyName,
            location: jobLocation,
          });
        }

        try {
          const response = await API.get(`/job/${jobId}/applications?page=1`);
          if (response.data?.data) {
            setApplications(response.data.data);
            setError(null);
            return;
          }
          setApplications([]);
        } catch (err: unknown) {
          if (isApiError(err) && err.response?.status === 404) {
            setApplications([]);
            return;
          }
          let errorMessage = 'Failed to fetch applications';
          if (isApiError(err)) {
            errorMessage += err.response?.data?.message
              ? `: ${err.response.data.message}`
              : ` (Status: ${err.response?.status})`;
          }
          setError(errorMessage);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplications();
    }
  }, [jobId, jobTitle, companyName, jobLocation]);

  const handleUpdateStatus = async (
    applicationId: number,
    newStatus: 'Pending' | 'Viewed' | 'Rejected' | 'Accepted'
  ) => {
    try {
      const response = await API.patch(
        `/job/applications/${applicationId}/status`,
        { status: newStatus }
      );

      if (!response.data) throw new Error('Invalid response from server');

      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );

      setNotification({
        open: true,
        message: `Application status updated to ${newStatus}`,
        severity: 'success',
      });
    } catch (err: unknown) {
      let errorMessage = 'Failed to update status';
      if (isApiError(err)) {
        errorMessage += ` (${err.response?.status})`;
        if (err.response?.data?.error || err.response?.data?.message) {
          errorMessage += `: ${err.response.data.error || err.response.data.message}`;
        }
      }
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  return (
    <>
      <MergeJobsNavbar />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          pt: { xs: 10, sm: 12 },
          pb: 6,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              mb: 4,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.main">
                  Applications
                </Typography>
                {jobDetails ? (
                  <>
                    <Typography variant="h6" fontWeight={500}>
                      {jobDetails.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {jobDetails.company_name} • {jobDetails.location}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle1" color="text.secondary">
                    Job ID: {jobId}
                  </Typography>
                )}
              </Box>
              <Chip
                label={`${applications.length} application${applications.length !== 1 ? 's' : ''}`}
                color="primary"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ mb: 4, borderColor: theme.palette.divider }} />

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Paper
                elevation={1}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  backgroundColor: theme.palette.error.light,
                  color: theme.palette.error.contrastText,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Error
                </Typography>
                <Typography variant="body1">{error}</Typography>
              </Paper>
            ) : applications.length > 0 ? (
              <Stack spacing={3}>
                {applications.map((application) => (
                  <ApplicationCard
                    key={application.application_id}
                    application={application}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </Stack>
            ) : (
              <Box textAlign="center" py={6}>
                <Typography variant="h6" gutterBottom>
                  No applications yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  When candidates apply to this job posting, they will appear here.
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ApplicationsPage;
