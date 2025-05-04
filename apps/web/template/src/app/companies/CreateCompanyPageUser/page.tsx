'use client';

import { Box, Grid, useTheme, Typography } from '@mui/material';
import { useEffect } from 'react';
import CompanySidebarUser from '@/app/components/CompanySidebarUser';
import AnalyticsPage from '@/app/components/AnalyticsPage';
import PagePostsUserCompany from '@/app/components/PagePostsUserCompany';
import CompanyJobsLists from '@/app/components/CompanyJobsList';
import { useNavigationStore } from '@/app/stores/useNavigationStore';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';
import Navbar from '@/app/components/Navbar';

export default function Page() {
  const theme = useTheme();
  const { activePage } = useNavigationStore();
  const { fetchCompanyProfile } = useCompanyStore();

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/company\/(\d+)/);
    if (match) {
      const companyId = parseInt(match[1], 10);
      fetchCompanyProfile(companyId);
    }
  }, [fetchCompanyProfile]);

  const renderContent = () => {
    switch (activePage) {
      case 'Feed':
        return (
          <Grid item xs={12}>
            <PagePostsUserCompany />
          </Grid>
        );
      case 'Company jobs':
        return (
          <Grid item xs={12}>
            <CompanyJobsLists />
          </Grid>
        );
      default:
        return (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.background.paper,
                borderRadius: 2,
                textAlign: 'center',
                color: theme.palette.text.secondary,
              }}
            >
              <Typography variant="body1">
                No content available for "{activePage}" yet.
              </Typography>
            </Box>
          </Grid>
        );
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <CompanySidebarUser />
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
            flexGrow: 1,
            bgcolor: 'inherit',
          }}
        >
          {renderContent()}
        </Grid>
      </Box>
    </>
  );
}
