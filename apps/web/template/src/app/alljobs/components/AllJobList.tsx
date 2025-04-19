'use client';
import React from 'react';
import { Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import { useJobFilterStore } from '../store/useJobFilterStore';

const AllJobList = () => {
  const { jobs, filters } = useJobFilterStore();

  const selectedCompanies = filters.company.split(',').filter(Boolean);
  const selectedExperience = filters.experienceLevel.split(',').filter(Boolean);
  const selectedSalary = filters.salary.split(',').filter(Boolean);

  const parseRange = (rangeStr: string): [number, number] => {
    if (rangeStr === '20000+') return [20000, Infinity];
    const [minStr, maxStr] = rangeStr.split('-');
    return [parseInt(minStr), parseInt(maxStr)];
  };

  const parseJobSalary = (salaryStr: string): [number, number] => {
    const match = salaryStr.match(/(\d+)[^\d]+(\d+)/);
    if (!match) return [0, 0];
    return [parseInt(match[1]), parseInt(match[2])];
  };

  const filteredJobs = jobs.filter((job) => {
    const companyMatch =
      selectedCompanies.length === 0 || selectedCompanies.includes(job.company);

    const experienceMatch =
      selectedExperience.length === 0 ||
      selectedExperience.includes(job.experienceLevel || '');

    const salaryMatch =
      selectedSalary.length === 0 ||
      selectedSalary.some((range) => {
        const [filterMin, filterMax] = parseRange(range);
        const [jobMin, jobMax] = parseJobSalary(job.salaryRange || '');
        return jobMax >= filterMin && jobMin <= filterMax;
      });

    return companyMatch && experienceMatch && salaryMatch;
  });

  return (
    <Grid container spacing={2}>
      {filteredJobs.map((job) => (
        <Grid item xs={12} md={6} lg={4} key={job.id}>
          <Card sx={{ p: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6">{job.title}</Typography>
              <Typography variant="subtitle2" sx={{ color: 'gray' }}>
                {job.company} • {job.location}
              </Typography>
              <Chip label={job.type} size="small" sx={{ mt: 1, mb: 1 }} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {job.description}
              </Typography>

              {job.salaryRange && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'green' }}>
                  Salary: {job.salaryRange}
                </Typography>
              )}
              {job.experienceLevel && (
                <Typography variant="caption" sx={{ display: 'block', color: 'blue' }}>
                  Experience: {job.experienceLevel}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AllJobList;
