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
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  useTheme,
  Stack,
  Divider,
} from '@mui/material';
import Navbar from '@/app/components/Jobsnavbar';
import ApplicationCard from './components/ApplicationCard';

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
  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // Only fetch job details if we don't have them from query params
        if (!jobTitle) {
          const jobResponse = await fetch(`https://api.ascendx.tech/job/${jobId}`, {
            headers: {
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0NTk1MzI2OCwiZXhwIjoxNzQ1OTk2NDY4fQ.qbls-HS1EPXglqpymZ_13YtIdzma3E4USsxgeVuNa1o',
            },
          });
          
          if (jobResponse.ok) {
            const jobData = await jobResponse.json();
            if (jobData.data) {
              setJobDetails(jobData.data);
            }
          }
        } else {
          // Use the information from query params
          setJobDetails({
            title: jobTitle,
            company_name: companyName,
            location: jobLocation
          });
        }
        
        // Fetch applications for this job as before
        try {
          const response = await fetch(`https://api.ascendx.tech/job/${jobId}/applications?page=1`, {
            headers: {
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0NTk1MzI2OCwiZXhwIjoxNzQ1OTk2NDY4fQ.qbls-HS1EPXglqpymZ_13YtIdzma3E4USsxgeVuNa1o',
            },
          });

          console.log('Application fetch response status:', response.status);
          
          if (!response.ok) {
            // Try to get more details about the error
            let errorDetails = '';
            try {
              const errorData = await response.json();
              errorDetails = JSON.stringify(errorData);
            } catch (jsonError) {
              errorDetails = 'Could not parse error response';
            }
            
            throw new Error(`Failed to fetch applications. Status: ${response.status}. Details: ${errorDetails}`);
          }

          const result: ApiResponse = await response.json();
          console.log('Applications data:', result);
          
          if (result.error) {
            throw new Error(result.error);
          }

          setApplications(result.data || []);
        } catch (err) {
          console.error('Error fetching applications:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch applications');
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch applications');
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
      // Use the correct endpoint with the job ID included
      const response = await fetch(`https://api.ascendx.tech/job/applications/${applicationId}/status`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0NTk1MzI2OCwiZXhwIjoxNzQ1OTk2NDY4fQ.qbls-HS1EPXglqpymZ_13YtIdzma3E4USsxgeVuNa1o',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // Log the response status for debugging
      console.log(`Status update response (${applicationId} → ${newStatus}):`, response.status);

      if (!response.ok) {
        // Try to get more details about the error
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData);
        } catch (jsonError) {
          errorDetails = 'Could not parse error response';
        }
        
        throw new Error(`Failed to update application status. Status: ${response.status}. Details: ${errorDetails}`);
      }

      // Update the local state with the new status
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.application_id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );

      // Show success message
      alert(`Application status successfully updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
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
    </>
  );
};

export default ApplicationsPage;