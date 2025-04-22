'use client';

import { useSearchParams } from 'next/navigation';
import { Typography, Box, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SaveJobPopup from './SaveJobPopup';
import { useJobStore } from '@/app/shared/store/useJobStore';
import ApplyJobModal from './ApplyModal';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box mb={4}>
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

    const handleSave = async () => {
      const job = {
        id,
        job_id: id , 
        title,
        company,
        location,
        type,
        description,
        about,
        requirements,
        industry: '', // Add appropriate value
        experience_level: '', // Add appropriate value
        workplace_type: '', // Add appropriate value
        salary: '', // Add appropriate value
        benefits: [], // Add appropriate value
        status: 'Saved' as 'Saved' | 'Applied',
      };

    // Save to local store
    //saveJob(job);

    // Save to backend
    try {
      const response = await fetch(`https://api.ascendx.tech/job/save/${id}`, {
        method: 'POST', headers:{'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ1MzE4Nzc1LCJleHAiOjE3NDUzNjE5NzV9.TWUfu3C5qZ37kNqjuOecUFKPGpHYkuJUV8SDRM9hPvI`},
      });

      if (!response.ok) {
        throw new Error(`Failed to save job: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving job to API:', error);
    }

    // Show confirmation + redirect
    setSavedJobPopupOpen(true);
    setTimeout(() => {
      router.push('/MyJobs');
    }, 1000);
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, maxWidth: '900px', mx: 'auto', mt: 5, mb: 3, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {company} • {location} • {type}
        </Typography>

        <Box display="flex" gap={2} my={2}>
          <Button variant="outlined" color="success" sx={{ borderRadius: '20px' }} onClick={handleSave}>
            Save
          </Button>
          <Button variant="contained" color="primary" sx={{ borderRadius: '20px' }} onClick={() => setApplyOpen(true)}>
            Apply
          </Button>
        </Box>


        <Section title="Job Description">
          <Typography>{description}</Typography>
        </Section>

        <SaveJobPopup />
      </Paper>

      <ApplyJobModal
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
        }}
      />
    </>
  );
};

export default JobDetails;
