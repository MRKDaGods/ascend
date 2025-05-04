'use client';

import { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';

export default function AnalyticsPage() {
  const { analytics, companyId, getCompanyAnalytics } = useCompanyStore();

  useEffect(() => {
    if (companyId) {
      getCompanyAnalytics(companyId);
    }
  }, [companyId]);

  const stats = [
    {
      label: 'Job Posts',
      value: analytics?.number_of_job_posts ?? 0,
      color: '#1976d2',
    },
    {
      label: 'Announcements',
      value: analytics?.number_of_announcements ?? 0,
      color: '#388e3c',
    },
    {
      label: 'Followers',
      value: analytics?.number_of_followrs ?? 0,
      color: '#f57c00',
    },
  ];

  return (
    <Box id="analytics-page" sx={{ flex: 1, p: { xs: 2, md: 4 }, backgroundColor: '#f9f9f9' }}>
      <Paper
        id="analytics-header"
        elevation={3}
        sx={{ p: 3, borderRadius: 3, backgroundColor: 'white', mb: 4 }}
      >
        <Typography id="analytics-title" variant="h5" fontWeight={600} gutterBottom>
          Company Analytics
        </Typography>
        <Typography id="analytics-subtitle" variant="body2" color="text.secondary">
          Insightful overview of your company's performance.
        </Typography>
      </Paper>

      {!analytics ? (
        <Box id="analytics-loading-container" sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress id="analytics-loading-spinner" />
        </Box>
      ) : (
        <Grid id="analytics-stats-grid" container spacing={3}>
          {stats.map((stat) => (
            <Grid id={`analytics-stat-grid-${stat.label.toLowerCase().replace(/\s+/g, '-')}`} item xs={12} sm={4} key={stat.label}>
              <Card id={`analytics-stat-card-${stat.label.toLowerCase().replace(/\s+/g, '-')}`} elevation={2} sx={{ borderRadius: 3 }}>
                <CardContent id={`analytics-stat-content-${stat.label.toLowerCase().replace(/\s+/g, '-')}`} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography
                    id={`analytics-stat-value-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                    variant="h3"
                    fontWeight={700}
                    sx={{ color: stat.color }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    id={`analytics-stat-label-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                    variant="subtitle1"
                    color="text.secondary"
                  >
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}