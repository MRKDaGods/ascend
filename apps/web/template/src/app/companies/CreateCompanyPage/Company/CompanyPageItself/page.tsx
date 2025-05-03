// pages/page.tsx
"use client";

import { Box, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "@/app/components/CompanySidebar";
import DashboardActions from "@/app/components/DashboardActions";
import ManagePosts from "@/app/components/ManagePosts";
import AnalyticsPage from "@/app/components/AnalyticsPage";
import { useNavigationStore } from "@/app/stores/useNavigationStore";
import PagePosts from "@/app/components/PagePosts";
import CompanySettings from "@/app/components/CompanySettings";
import Navbar from "@/app/components/Navbar";
import CompanyJobsLists from "@/app/components/CompanyJobsList";

export default function Page() {
  const { activePage } = useNavigationStore();
  const theme = useTheme();

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
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
      case "Analytics":
        return (
          <Grid id="analytics-page-grid" item xs={12}>
            <AnalyticsPage />
          </Grid>
        );
      case "Edit page":
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
      case "Feed":
        return (
          <>
            <Grid id="edit-page-dashboard-actions-grid" item xs={12}>
              <CompanyJobsLists />
            </Grid>
          </>
        );
      case "Page posts":
        return (
          <Grid id="page-posts-grid" item xs={12}>
            <PagePosts />
          </Grid>
        );
      case "Deactivate Page":
        return (
          <Grid id="deactivate-page-grid" item xs={12}>
            <CompanySettings />
          </Grid>
        );
      default:
        return (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                color: theme.palette.text.secondary,
                bgcolor: theme.palette.background.paper,
                borderRadius: 1,
              }}
            >
              No content available for "{activePage}" yet.
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
          display: "flex",
          minHeight: "100vh",
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Sidebar />
        <Grid
          container
          spacing={2}
          sx={{
            padding: 2,
            flexGrow: 1,
            bgcolor: "inherit",
          }}
        >
          {renderContent()}
        </Grid>
      </Box>
    </>
  );
}
