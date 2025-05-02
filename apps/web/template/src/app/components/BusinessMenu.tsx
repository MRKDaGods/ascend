import React from 'react';
import { Box, Divider, Typography, Link } from '@mui/material';
import MyAppsSection from './MyAppsSection';
import ExploreMoreSection from './ExploreMoreSection';
import { useRouter } from "next/navigation";

export default function BusinessMenu() {
    const router = useRouter();
  
  return (
    <Box id="business-menu" display="flex" flexDirection="column" width={700}>
      <Box id="business-menu-content" display="flex" p={3} flexGrow={1}>
        <MyAppsSection />
        <Divider id="vertical-divider" orientation="vertical" flexItem sx={{ mx: 2 }} />
        <ExploreMoreSection />
      </Box>
      <Divider id="horizontal-divider" />
      <Box id="business-menu-links" p={2}>
        <Link
          id="create-company-page-link"
          href="#"
          underline="hover"
          variant="subtitle1"
          onClick={() => router.push("/CreateCompanyPage")}
        >
          Create a Company Page +
        </Link>
        <Link
          id="explore-companies-link"
          href="#"
          underline="hover"
          variant="subtitle1"
          sx={{ ml: 12 }}
          onClick={() => router.push("/ExploreCompanies")}
        >
          Explore Companies
        </Link>
      </Box>
    </Box>
  );
}