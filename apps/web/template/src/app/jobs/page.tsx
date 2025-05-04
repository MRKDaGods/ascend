"use client";

import { Box, Container, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MergeJobsNavbar from "../components/MergeJobsNavbar";
import ProfileCard from "../components/ProfileCard";
import ListCard from "../components/ListCard";
import JobPreferences from "../components/lookingfor";
import JobList from "../components/JobsList"; 
import Recommends from "../components/FinalRecommends";

function JobsPage() {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <MergeJobsNavbar />

      <Container
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: { xs: "stretch", md: "flex-start" },
          gap: 7,
          px: { xs: 1, sm: 2 },
          maxWidth: "1400px",
          pb: 5,
        }}
      >
        {/* Left Panel */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "280px" },
            display: "flex",
            flexDirection: "column",
            gap: 2, // Changed from 3 to 2 to match ProfileCard spacing
            position: { md: "sticky" },
            top: { md: "80px" },
            alignSelf: "flex-start",
            "& > *": { // Add this to ensure both cards have same width
              width: "100%",
            }
          }}
        >
          <ProfileCard />
          <ListCard />
        </Box>

        {/* Center Panel */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "700px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack spacing={3} sx={{ width: "100%" }}>
            <JobPreferences />
            <JobList />
            <Recommends />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default JobsPage;