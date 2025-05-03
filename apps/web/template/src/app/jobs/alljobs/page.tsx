'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import JobFilter from '@/app/components/JobFilter';
import { useJobFilterStore } from '@/app/stores/useJobFilterStore';
import JobItem from '@/app/components/JobItem';
import { useHasHydrated } from '@/app/hooks/useHasHydrated';

const buildQuery = (filters: Record<string, any>) => {
  const query = new URLSearchParams();
  
  // Map the filter keys to the API expected keys
  const keyMapping: Record<string, string> = {
    'salary_range_min': 'salary_min_range',
    'salary_range_max': 'salary_max_range'
  };
  
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === '' || value === null || (Array.isArray(value) && value.length === 0)) continue;
    
    // Use the mapped key if it exists, otherwise use the original key
    const apiKey = keyMapping[key] || key;
    
    // Format value properly based on type
    if (Array.isArray(value)) {
      query.append(apiKey, value.join(','));
    } else if (typeof value === 'number') {
      query.append(apiKey, value.toString());
    } else if (typeof value === 'string') {
      // Encode special characters
      query.append(apiKey, encodeURIComponent(value.trim()));
    } else {
      query.append(apiKey, String(value));
    }
  }
  return query.toString();
};

const cleanFilters = (filters: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(filters).filter(([key, value]) => {
      // Handle different value types
      if (value === undefined || value === null) return false;
      if (value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if ((key === 'salary_range_min' || key === 'salary_range_max') && (value <= 0 || isNaN(value))) return false;
      
      return true;
    })
  );
};

export default function JobsPage() {
  const {
    keyword,
    location,
    industry,
    experience_level,
    company,
    workplace_type,
    salary_range_min,
    salary_range_max,
    jobs,
    setJobs,
  } = useJobFilterStore();

  const [loading, setLoading] = useState(true);
  const hasHydrated = useHasHydrated();

  const fetchJobs = async () => {
    setLoading(true);

    const filters = cleanFilters({
      keyword: keyword || undefined,
      location: location || undefined,
      industry: industry || undefined,
      experience_level: experience_level.length > 0 ? experience_level : undefined,
      company: company || undefined,
      workplace_type: workplace_type || undefined,
      salary_range_min: salary_range_min && salary_range_min > 0 ? salary_range_min : undefined,
      salary_range_max: salary_range_max && salary_range_max > 0 ? salary_range_max : undefined,
      page: 1,
    });

    console.log('Filters:', filters);

    // Provide default empty results even with no filters
    if (Object.keys(filters).length === 0) {
      console.log('No filters provided, fetching all jobs');
      // Continue with the API call to get all jobs instead of skipping
    }

    const queryString = buildQuery(filters);
    const url = `https://api.ascendx.tech/job/${queryString ? `?${queryString}` : ''}`;
    console.log('Fetching URL:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        
        // Handle common HTTP errors
        if (response.status === 429) {
          console.error('Rate limit exceeded. Please try again later.');
        } else if (response.status >= 500) {
          console.error('Server error. Please try again later.');
        }
        
        setJobs([]);
        return;
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data && Array.isArray(data.data)) {
        setJobs(data.data);
      } else {
        console.error('Unexpected data format:', data);
        setJobs([]);
      }
    } catch (error: unknown) {
      // TypeScript-safe error handling
      const err = error as Error; // Cast to Error type
      
      if (typeof err === 'object' && err !== null && 'name' in err && err.name === 'AbortError') {
        console.error('Request timed out');
      } else {
        console.error('Failed to fetch jobs:', err);
      }
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [
    keyword,
    location,
    industry,
    experience_level,
    company,
    workplace_type,
    salary_range_min,
    salary_range_max,
    setJobs,
  ]);

  if (!hasHydrated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, md: 4 }} sx={{ backgroundColor: '#f3f6f9', minHeight: '100vh' }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 5,
          borderRadius: 4,
          backgroundColor: '#ffffff',
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{ color: '#1a237e', fontSize: { xs: '2rem', md: '2.8rem' } }}
        >
          Find Your Next Opportunity
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#5f6368', mb: 4, maxWidth: '600px' }}
        >
          Use filters to refine your search and discover opportunities tailored to your skills and preferences.
        </Typography>

        <JobFilter />
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress />
        </Box>
      ) : jobs && jobs.length > 0 ? (
        <Grid container spacing={4}>
          {jobs.map((job) => {
            const formattedJob = {
              job_id: job.job_id,
              title: job.title,
              company: job.company_name,
              location: job.location,
              type: job.type,
              description: job.description,
              experienceLevel: job.experience_level,
              salaryRange:
                job.salary_min_range != null && job.salary_max_range != null
                  ? `$${job.salary_min_range} - $${job.salary_max_range}`
                  : 'Not specified',
            };

            return (
              <Grid item xs={12} sm={6} md={4} key={job.job_id}>
                <JobItem {...formattedJob} />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box textAlign="center" mt={6}>
          <Typography variant="h6" color="text.secondary">
            No jobs found.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters to see more results.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
