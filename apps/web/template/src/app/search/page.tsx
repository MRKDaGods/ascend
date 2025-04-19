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
  id: string;
  title: string;
  company: string;
  location: string;
  logo: string;
  description: string;
  tags: string[];
  type?: string;
  about?: string;
  requirements?: string[];
  qualifications?: string[];
}

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const job = searchParams.get('job') || '';
  const location = searchParams.get('location') || '';

  const [results, setResults] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/jobs?title=${encodeURIComponent(job)}&location=${encodeURIComponent(location)}`
        );
        if (!response.ok) throw new Error('Failed to fetch results');
        const data = await response.json();
        const safeJobs = (Array.isArray(data) ? data : data.jobs || []).map((job: Job) => ({
          ...job,
          tags: Array.isArray(job.tags) ? job.tags : [],
        }));
        setResults(safeJobs);
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
      company: job.company,
      location: job.location,
      description: job.description,
      type: job.type || 'Full-time',
      id: job.id.toString(),
      about: job.about || '',
      requirements: job.requirements?.join(',') || '',
      qualifications: job.qualifications?.join(',') || ''
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
              key={job.id}
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
                  <Avatar src={job.logo} alt={job.company} sx={{ width: 48, height: 48 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#0073b1' }}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {job.company} — {job.location}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ mb: 2, color: '#444' }}>
                  {job.description.length > 100
                    ? job.description.slice(0, 100) + '...'
                    : job.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {(job.tags || []).map((tag, idx) => (
                    <Chip key={idx} label={tag} size="small" />
                  ))}
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
