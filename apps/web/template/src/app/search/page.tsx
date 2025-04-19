'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Chip,
  Button,
} from '@mui/material';

interface Job {
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

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const job = searchParams.get('keyword') || '';
  const location = searchParams.get('location') || '';

  const [results, setResults] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`https://api.ascendx.tech/job/search`);
        if (!response.ok) throw new Error('Failed to fetch results');
        const data = await response.json();
        const safeJobs = Array.isArray(data.data) ? data.data : [];

        // Optional: Filter on client-side using query params
        const filtered = safeJobs.filter((jobObj: Job) =>
          jobObj.title.toLowerCase().includes(job.toLowerCase()) &&
          jobObj.location.toLowerCase().includes(location.toLowerCase())
        );

        setResults(filtered);
      } catch (error) {
        console.error('Error fetching results:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [job, location]);

  const handleApply = (job: Job) => {
    const params = new URLSearchParams({
      title: job.title,
      company: job.company_name,
      location: job.location,
      description: job.description,
      type: job.type || 'Full-time',
      id: job.job_id.toString(),
    });
    router.push(`/apply?${params.toString()}`);
  };

  return (
    <Box sx={{ p: 4, mt: 8, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }} color="black">
        Search Results for "{job}" in "{location}"
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : results.length === 0 ? (
        <Typography variant="body1">No results found.</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          {results.map((job) => (
            <Card
              key={job.job_id}
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                backgroundColor: 'white',
                p: 2,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.01)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar src={job.company_logo_url || ''} alt={job.company_name} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#0073b1' }}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.company_name} — {job.location}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ mb: 2, color: '#444' }}>
                  {job.description.length > 100
                    ? job.description.slice(0, 100) + '...'
                    : job.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {/* You can display additional job tags here */}
                  <Chip label={job.experience_level} size="small" />
                  <Chip label={job.workplace_type} size="small" />
                  <Chip label={job.type} size="small" />
                </Box>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleApply(job)}
                  sx={{
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontWeight: 500,
                    backgroundColor: '#0073b1',
                    '&:hover': {
                      backgroundColor: '#005f94',
                    },
                  }}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchResultsPage;
