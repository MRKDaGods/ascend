'use client';

import { useSearchParams } from 'next/navigation';
import { Typography, Box, Paper, Button, Chip, Grid, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SaveJobPopup from '../components/SaveJobPopup';
import { useJobStore } from '@/app/stores/useJobStore';
import ApplyModal from './ApplyModal'; 

const Section = ({ title, children, mt = 4 }: { title: string; children: React.ReactNode, mt?: number }) => (
  <Box mb={4} mt={mt}>
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    {children}
  </Box>
);

const JobDetails = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSavedJobPopupOpen, saveJob } = useJobStore();

  const [isReady, setIsReady] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  const id = parseInt(searchParams.get('id') || '0');
  const title = searchParams.get('title') || '';
  const company = searchParams.get('company') || '';
  const location = searchParams.get('location') || '';
  const description = searchParams.get('description') || '';
  const type = searchParams.get('type') || '';
  const about = searchParams.get('about') || '';
  const requirements = searchParams.get('requirements')?.split(',') || [];
  const industry = searchParams.get('industry') || '';
  const experience_level = searchParams.get('experience_level') || '';
  const workplace_type = searchParams.get('workplace_type') || '';
  const salary_min_range = searchParams.get('salary_min_range') ? parseInt(searchParams.get('salary_min_range') || '0') : null;
  const salary_max_range = searchParams.get('salary_max_range') ? parseInt(searchParams.get('salary_max_range') || '0') : null;

  // Format salary display
  const formatSalary = () => {
    if (salary_min_range && salary_max_range) {
      return `$${salary_min_range.toLocaleString()} - $${salary_max_range.toLocaleString()}`;
    } else if (salary_min_range) {
      return `From $${salary_min_range.toLocaleString()}`;
    } else if (salary_max_range) {
      return `Up to $${salary_max_range.toLocaleString()}`;
    }
    return 'Not specified';
  };

  const handleSave = async () => {
    const job = {
      id,
      job_id: id,
      title,
      company,
      location,
      type,
      description,
      about,
      requirements,
      industry,
      experience_level,
      workplace_type,
      salary_min_range,
      salary_max_range,
      status: 'Saved' as 'Saved' | 'Applied',
    };

    try {
      const response = await fetch(`https://api.ascendx.tech/job/saved/${job.id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to save job: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving job to API:', error);
    }

    setSavedJobPopupOpen(true);
    setTimeout(() => {
      router.push('/jobs/MyJobs');
    }, 1000);
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{ p: 4, maxWidth: '900px', mx: 'auto', mt: 5, mb: 3, borderRadius: 3 }}
      >
        {/* Job Header */}
        <Box mb={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {company} • {location} • {type}
          </Typography>
          
          {/* Job action buttons */}
          <Box display="flex" gap={2} mt={2}>
            <Button 
              variant="outlined" 
              onClick={handleSave}
              startIcon={<BookmarkIcon />}
              data-testid="job-detail-save-button"
              sx={{ 
                borderRadius: '20px',
                borderColor: '#4caf50', // Green border
                '&:hover': {
                  borderColor: '#388e3c', // Darker green on hover
                }
              }}
            >
              Save
            </Button>

            <Button 
              variant="contained" 
              onClick={() => {
                console.log('Opening apply modal');
                setApplyOpen(true);
              }}
              data-testid="job-detail-apply-button"
              sx={{ borderRadius: '20px' }}
            >
              Apply
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Job Details Section */}
        <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
          Job Details
        </Typography>
        
        {/* Job metadata */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {salary_min_range || salary_max_range ? (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">Salary</Typography>
              <Typography variant="body1" fontWeight="500">{formatSalary()}</Typography>
            </Grid>
          ) : null}
          
          {industry ? (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">Industry</Typography>
              <Typography variant="body1" fontWeight="500">{industry}</Typography>
            </Grid>
          ) : null}
          
          {experience_level ? (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">Experience Level</Typography>
              <Typography variant="body1" fontWeight="500">{experience_level}</Typography>
            </Grid>
          ) : null}
          
          {workplace_type ? (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">Workplace</Typography>
              <Typography variant="body1" fontWeight="500">{workplace_type}</Typography>
            </Grid>
          ) : null}
          
          {type ? (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">Job Type</Typography>
              <Typography variant="body1" fontWeight="500">{type}</Typography>
            </Grid>
          ) : null}
          
          {location ? (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">Location</Typography>
              <Typography variant="body1" fontWeight="500">{location}</Typography>
            </Grid>
          ) : null}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Job Description */}
        <Section title="Job Description" mt={0}>
          <Typography sx={{ whiteSpace: 'pre-line' }}>{description}</Typography>
        </Section>

        {/* Requirements Section, only show if there are requirements */}
        {requirements && requirements.length > 0 && requirements[0] !== '' && (
          <Section title="Requirements">
            <List>
              {requirements.map((requirement, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: '30px' }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={requirement.trim()} />
                </ListItem>
              ))}
            </List>
          </Section>
        )}

        {/* About Company Section, only show if there is about text */}
        {about && (
          <Section title={`About ${company}`}>
            <Typography sx={{ whiteSpace: 'pre-line' }}>{about}</Typography>
          </Section>
        )}

        <SaveJobPopup />
      </Paper>

      {/* ✅ Render the real ApplyModal */}
      <ApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        job={{
          id: id.toString(),
          company,
          title,
          location,
          type,
          description,
          about,
          requirements,
          industry,
          experience_level,
          workplace_type,
          salary_min_range,
          salary_max_range,
        }}
      />
    </>
  );
};

export default JobDetails;
