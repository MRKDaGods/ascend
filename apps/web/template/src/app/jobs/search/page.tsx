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
  Container,
  Fade,
  Paper,
} from '@mui/material';
import Navbar from '../../components/Navbar';

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
    <>
      <Navbar />
      <Box
        sx={{
          pt: { xs: 10, sm: 12 },
          pb: 6,
          minHeight: '100vh',
          backgroundColor: '#f9fafb',
        }}
      >
        <Container maxWidth="md">
          <Paper elevation={2} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.main">
              Search Results
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Showing results for "<strong>{job}</strong>" in "<strong>{location}</strong>"
            </Typography>
          </Paper>

          {loading ? (
            <Box display="flex" justifyContent="center" mt={10}>
              <CircularProgress />
            </Box>
          ) : results.length === 0 ? (
            <Paper
              elevation={1}
              sx={{
                p: 4,
                borderRadius: 4,
                textAlign: 'center',
                backgroundColor: '#ffffff',
              }}
            >
              <Typography variant="h6" gutterBottom>
                No results found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try different keywords or locations to see more opportunities.
              </Typography>
            </Paper>
          ) : (
            <Box display="flex" flexDirection="column" gap={3}>
              {results.map((job, index) => (
                <Fade in timeout={300 + index * 100} key={job.job_id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 2,
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
                        <Avatar
                          src={job.company_logo_url || ''}
                          alt={job.company_name}
                          sx={{ width: 56, height: 56 }}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight="bold" color="primary.main">
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
                </Fade>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default SearchResultsPage;
