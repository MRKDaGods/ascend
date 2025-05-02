"use client"; // only if you're using Next.js App Router

import { Box, Grid, Stack } from "@mui/material";
// import Jobsnavbar from "../components/Jobsnavbar";
import MergeJobsNavbar from "../components/MergeJobsNavbar";
import ProfileCard from "../components/ProfileCard";
import ListCard from "../components/ListCard";
import JobPreferences from "../components/lookingfor";
import JobList from "../components/JobsList";
import Recommends from "../components/FinalRecommends";
import { useTheme } from "@mui/material/styles";  

function JobsPage() {
  const theme = useTheme(); // Access the current theme
  return (
    <>
      {/* <Jobsnavbar /> */}
      <MergeJobsNavbar />

      {/* Main Content Area */}
      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // column on mobile, row on desktop
          alignItems: "flex-start", // Align items at the top
          gap: 3, // 24px gap
          pl: { xs: 2, md: 7 }, // padding-left: 16px on mobile, 56px on desktop
          pr: { xs: 2, md: 2 }, // padding-right: 16px
          minHeight: "100vh",
        }}
      >
        {/* Left Column: ProfileCard + ListCard */}
        <Stack
          spacing={3}
          sx={{
            flexShrink: 0,
            width: { xs: "100%", md: "300px" },
            alignItems: { xs: "center", md: "flex-start" }, // center on mobile, left on desktop
            mt: "30px", // Adjust the margin-top to reduce spacing
            textAlign: { xs: "center", md: "left" }, // optional: center the text inside too
          }}
        >
          <Box sx={{ width: { xs: "90%", md: "100%" } }}>
            <ProfileCard />
          </Box>
          <Box sx={{ width: { xs: "90%", md: "100%" } }}>
            <ListCard />
          </Box>
        </Stack>

        {/* Right Column: JobPreferences + JobList */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: "flex-start", // Align content at the top
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "700px" }}>
            <Stack spacing={3}
            sx={{
              mt: "30px", // Adjust the margin-top to reduce spacing

            }}>
              <JobPreferences />
              <JobList />
              <Recommends />
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default JobsPage;