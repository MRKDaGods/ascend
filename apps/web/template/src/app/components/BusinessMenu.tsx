import React from 'react';
import { Box, Divider, Typography, Link } from '@mui/material';
import MyAppsSection from './MyAppsSection';
import ExploreMoreSection from './ExploreMoreSection';
import { useRouter } from "next/navigation";


export default function BusinessMenu() {
    const router = useRouter();
  
  return (
    
    <Box display="flex" flexDirection="column" width={700}>
      <Box display="flex" p={3} flexGrow={1}>
        <MyAppsSection />
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        <ExploreMoreSection />
      </Box>
      <Divider />
      <Box p={2}>
        <Link href="#" underline="hover" variant="subtitle1" onClick={() => router.push("/CreateCompanyPage")}>
          Create a Company Page +
        </Link>
      </Box>
    </Box>
  );
}