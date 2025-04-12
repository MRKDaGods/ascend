'use client';

import { useSearchParams } from 'next/navigation';
import { Typography, Box, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Make sure this only runs on client
    setIsReady(true);
  }, []);

  if (!isReady) return null; // Don't render anything on server

  const id = parseInt(searchParams.get('id') || '0');
  const title = searchParams.get('title') || '';
  const company = searchParams.get('company') || '';
  const location = searchParams.get('location') || '';
  const description = searchParams.get('description') || '';
  const type = searchParams.get('type') || '';
  const about = searchParams.get('about') || '';
  const requirements = searchParams.get('requirements')?.split(',') || [];

  const handleSave = async () => {
    try {
      await fetch('http://localhost:5000/my-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title,
          company,
          location,
          type,
          description,
          about,
          requirements,
        }),
      });
      router.push('/MyJobs');
    } catch (err) {
      console.error('Failed to save job:', err);
    }
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
    </Paper>
  );
};

export default JobDetails;
