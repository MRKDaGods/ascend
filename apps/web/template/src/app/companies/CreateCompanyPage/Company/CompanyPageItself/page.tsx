// pages/page.tsx
'use client';

import { Box, Grid } from '@mui/material';
import Sidebar from '@/app/components/CompanySidebar';
import DashboardActions from '@/app/components/DashboardActions';
import ManagePosts from '@/app/components/ManagePosts';
import AnalyticsPage from '@/app/components/AnalyticsPage';
import { useNavigationStore } from '@/app/stores/useNavigationStore';
import PagePosts from '@/app/components/PagePosts';
import CompanySettings from '@/app/components/CompanySettings';
import Navbar from '@/app/components/Navbar';

export default function Page() {
  const { activePage } = useNavigationStore();

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return (
          <>
            <Grid item xs={12}>
              <DashboardActions />
            </Grid>
            <Grid item xs={12}>
              <ManagePosts />
            </Grid>
          </>
        );
      case 'Analytics':
        return (
          <Grid item xs={12}>
            <AnalyticsPage />
          </Grid>
        );
      case 'Edit page':
        return (
          <>
            <Grid item xs={12}>
              <DashboardActions />
            </Grid>
            <Grid item xs={12}>
              <ManagePosts />
            </Grid>
          </>
        );
        case 'Page posts':
          return (
            <Grid item xs={12}>
              <PagePosts />
            </Grid>
          );
          case 'Deactivate Page':
          return (
            <Grid item xs={12}>
              <CompanySettings />
            </Grid>
          );
          
      default:
        return (
          <Grid item xs={12}>
            <Box sx={{ p: 2 }}>No content available for "{activePage}" yet.</Box>
          </Grid>
        );
    }
  };

  return (
    <>
    <Navbar />
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f3ef' }}>
      <Sidebar />
      <Grid container spacing={2} sx={{ padding: 2, flexGrow: 1 }}>
        {renderContent()}
      </Grid>
    </Box>
    </>
  );
}
