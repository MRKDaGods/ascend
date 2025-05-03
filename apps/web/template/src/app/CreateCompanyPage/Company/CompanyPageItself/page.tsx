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
import CompanyJobsLists from '@/app/components/CompanyJobsList';

export default function Page() {
  const { activePage } = useNavigationStore();

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return (
          <>
            <Grid id="dashboard-actions-grid" item xs={12}>
              <DashboardActions />
            </Grid>
            <Grid id="manage-posts-grid" item xs={12}>
              <ManagePosts />
            </Grid>
          </>
        );
      case 'Analytics':
        return (
          <Grid id="analytics-page-grid" item xs={12}>
            <AnalyticsPage />
          </Grid>
        );
        case 'Edit page':
        return (
          <>
            <Grid id="edit-page-dashboard-actions-grid" item xs={12}>
              <DashboardActions />
            </Grid>
            <Grid id="edit-page-manage-posts-grid" item xs={12}>
              <ManagePosts />
            </Grid>
          </>
        );
      case 'Feed':
        return (
          <>
            <Grid id="edit-page-dashboard-actions-grid" item xs={12}>
              <CompanyJobsLists />
            </Grid>
          </>
        );
      case 'Page posts':
        return (
          <Grid id="page-posts-grid" item xs={12}>
            <PagePosts />
          </Grid>
        );
      case 'Deactivate Page':
        return (
          <Grid id="deactivate-page-grid" item xs={12}>
            <CompanySettings />
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
    <Box id="company-page-container" sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f3ef' }}>
      <Sidebar />
      <Grid id="company-page-content-grid" container spacing={2} sx={{ padding: 2, flexGrow: 1 }}>
        {renderContent()}
      </Grid>
    </Box>
  );
}
