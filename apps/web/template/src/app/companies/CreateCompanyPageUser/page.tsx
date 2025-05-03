// pages/page.tsx
'use client';

import { Box, Grid } from '@mui/material';
import { useEffect } from 'react';
import CompanySidebarUser from '@/app/components/CompanySidebarUser';
import AnalyticsPage from '@/app/components/AnalyticsPage';
import PagePostsUserCompany from '../../components/PagePostsUserCompany';
import { useNavigationStore } from '@/app/stores/useNavigationStore';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';
import Navbar from '@/app/components/Navbar';

export default function Page() {
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
          <Grid id="feed-grid" item xs={12}>
            <PagePostsUserCompany />
          </Grid>
        );
      case 'Company jobs':
        return (
          <Grid id="analytics-grid" item xs={12}>
            <CompanyJobsLists />
          </Grid>
        );
      default:
        return (
          <Grid id="default-content-grid" item xs={12}>
            <Box id="default-content-box" sx={{ p: 2 }}>
              No content available for "{activePage}" yet.
            </Box>
          </Grid>
        );
    }
  };

  return (
    <>
    <Navbar />
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f3ef' }}>
      <CompanySidebarUser />
      <Grid id="user-company-content-grid" container spacing={2} sx={{ padding: 2, flexGrow: 1 }}>
        {renderContent()}
      </Grid>
    </Box>
    </>
  );
}