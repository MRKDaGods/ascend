'use client';

import { useSearchParams } from 'next/navigation';
import { Typography, Box, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SaveJobPopup from './SaveJobPopup';
import { useJobStore } from '@/app/shared/store/useJobStore';

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

  const handleSave = () => {
    const job = {
      id,
      title,
      company,
      location,
      type,
      description,
      about,
      requirements,
      status: 'Saved' as 'Saved' | 'Applied', // Define JobStatus inline
    };
  
    saveJob(job);
    setSavedJobPopupOpen(true);
  
    setTimeout(() => {
      router.push('/MyJobs');
    }, 1000);
  };
  
  return (
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
        <Button variant="contained" color="primary" sx={{ borderRadius: '20px' }}>
          Apply
        </Button>
      </Box>

      <Section title="About Us">
        <Typography>{about}</Typography>
      </Section>

      <Section title="Job Description">
        <Typography>{description}</Typography>
      </Section>

      <Section title="Requirements">
        <ul>
          {requirements.map((req, index) => (
            <li key={index}>
              <Typography>{req}</Typography>
            </li>
          ))}
        </ul>
      </Section>

      <SaveJobPopup />
    </Paper>
  );
};

export default JobDetails;
