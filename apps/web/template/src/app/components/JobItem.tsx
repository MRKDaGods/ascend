import React, { useState, useEffect } from 'react';
import API from '@/api/api';
import { Box, Typography, Card, CardContent, CardActions, Button, Avatar, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const JobItem = ({ job_id, ...props }: any) => {
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await API.get(`/job/${job_id}`);
        if (!response.data) {
          throw new Error('No data received from server');
        }
        
        if (!response.data.data) {
          throw new Error('Job not found');
        }
        
        setJobDetails(response.data.data);
        setError(null);
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error.message || 'Failed to load job details';
        setError(errorMessage);
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [job_id]);

  if (loading) {
    return <Box sx={{ p: 2, textAlign: 'center' }}>Loading...</Box>;
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
        {error}
      </Box>
    );
  }

  const {
    title, 
    company, 
    location, 
    type, 
    description, 
    experienceLevel, 
    salaryRange,
    company_logo_url,
    industry,
    workplace_type,
    experience_level,
    salary_min_range,
    salary_max_range,
    about,
    requirements,
    company_name
  } = jobDetails;

  const displayCompany = company || company_name || 'Company';
  const [imgError, setImgError] = useState(false);

  interface JobType {
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
    created_at: Date;
  }

  const handleApplyClick = (job: JobType) => {
    const params = new URLSearchParams({
      id: job.job_id.toString(),
      title: job.title,
      company: job.company_name,
      location: job.location,
      type: job.type,
      description: job.description,
      industry: job.industry || '',
      experience_level: job.experience_level || '',
      workplace_type: job.workplace_type || '',
      ...(job.salary_min_range && { salary_min_range: job.salary_min_range.toString() }),
      ...(job.salary_max_range && { salary_max_range: job.salary_max_range.toString() })
    });
    
    router.push(`/jobs/apply?${params.toString()}`);
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden', 
        mb: 2,
        height: '300px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            {company_logo_url && !imgError ? (
              <Avatar
                src={company_logo_url}
                alt={displayCompany}
                sx={{ width: 50, height: 50, cursor: "pointer" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <Avatar
                sx={{ 
                  width: 56, 
                  height: 56,
                  bgcolor: company_logo_url ? 'transparent' : 'primary.main',
                }}
                data-testid="PersonIcon"
              >
                {displayCompany.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </Grid>
          <Grid item xs>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {displayCompany} - {location}
            </Typography>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Type:</strong> {type}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Experience Level:</strong> {experienceLevel || experience_level}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Salary:</strong> {salaryRange || (salary_min_range && salary_max_range ? 
              `$${salary_min_range.toLocaleString()} - $${salary_max_range.toLocaleString()}` : 
              'Not specified')}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            mt={1}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.4em',
              maxHeight: '4.2em',
            }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleApplyClick({
            job_id,
            title,
            description,
            industry: industry || '',
            type,
            experience_level: experienceLevel || experience_level || '',
            location,
            workplace_type: workplace_type || '',
            salary_min_range: salary_min_range || null,
            salary_max_range: salary_max_range || null,
            company_id: 0, // Replace with actual company_id if available
            company_name: displayCompany,
            company_logo_url: company_logo_url || null,
            created_at: new Date() // Replace with actual created_at if available
          })}
          data-testid="job-item-apply-button"
          sx={{ borderRadius: '20px' }}
        >
          Apply Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobItem;
