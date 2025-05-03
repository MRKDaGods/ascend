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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';    
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
  
  // Get job details from query params (passed from JobCard)
  const jobTitle = searchParams.get('title') || '';
  const companyName = searchParams.get('company') || '';
  const jobLocation = searchParams.get('location') || '';
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // Fetch job details first
        if (!jobTitle) {
          try {
            const jobResponse = await API.get(`/job/${jobId}`);
            if (jobResponse.data && jobResponse.data.data) {
              setJobDetails(jobResponse.data.data);
            }
          } catch (err: unknown) {
            console.error('Error fetching job details:', err);
            if (isApiError(err)) {
              console.error(`Status: ${err.response?.status}, Message: ${err.response?.data?.error}`);
            }
          }
        } else {
          setJobDetails({
            title: jobTitle,
            company_name: companyName,
            location: jobLocation
          });
        }
        
        // Fetch applications with improved error handling
        try {
          const response = await API.get(`/job/${jobId}/applications?page=1`);
          
          // Success case
          if (response.data?.data) {
            setApplications(response.data.data);
            setError(null);
            return;
          }
          
          // No applications case
          setApplications([]);
          setError(null);
          
        } catch (err: unknown) {
          // Handle 404 gracefully
          if (isApiError(err) && err.response?.status === 404) {
            setApplications([]);
            setError(null);
            return;
          }
          
          // Handle other errors
          console.error('Error fetching applications:', err);
          let errorMessage = 'Failed to fetch applications';
          if (isApiError(err)) {
            errorMessage += err.response?.data?.message 
              ? `: ${err.response.data.message}`
              : ` (Status: ${err.response?.status})`;
          }
          setError(errorMessage);
        }
      } catch (err: unknown) {
        console.error('Overall error in fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplications();
    }
  }, [jobId, jobTitle, companyName, jobLocation]);

  const handleUpdateStatus = async (applicationId: number, newStatus: 'Pending' | 'Viewed' | 'Rejected' | 'Accepted') => {
    try {
      const response = await API.patch(`/job/applications/${applicationId}/status`, {
        status: newStatus
      });

      console.log(`Status update response (${applicationId} → ${newStatus}):`, response);

      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.application_id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );

      setNotification({
        open: true,
        message: `Application status successfully updated to ${newStatus}`,
        severity: 'success',
      });
    } catch (err: unknown) {
      console.error('Error updating application status:', err);
      
      let errorMessage = 'Failed to update application status';
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

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification(prev => ({...prev, open: false}));
  };

  return (
    <>
      <MergeJobsNavbar />
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #f4f6f8, #ffffff)',
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
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <div>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary.main">
                  Applications
                </Typography>
                {jobDetails ? (
                  <>
                    <Typography variant="h6" fontWeight="500" gutterBottom>
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
              </div>
              
              <Chip 
                label={`${applications.length} application${applications.length !== 1 ? 's' : ''}`}
                color="primary"
                variant="outlined"
              />
            </Box>
            
            <Divider sx={{ mb: 4 }} />

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Paper elevation={1} sx={{ p: 4, backgroundColor: '#fdeded', borderRadius: 2 }}>
                <Typography color="error" variant="h6" gutterBottom>
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
      
      {/* Success/Error Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
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