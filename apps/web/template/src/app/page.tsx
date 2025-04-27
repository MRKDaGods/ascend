"use client"; // only if you're using Next.js App Router

import { Box, Grid, Stack } from "@mui/material";
import Navbar from "./components/navbar";
import ProfileCard from "./components/ProfileCard";
import ListCard from "./components/ListCard";
import JobPreferences from "./components/lookingfor";
import JobList from "./components/JobsList";
import Recommends from "./components/recommends";

function Home() {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // column on mobile, row on desktop
          alignItems: { xs: "center", md: "flex-start" },
          gap: 3, // 24px gap
          pl: { xs: 2, md: 7 }, // padding-left: 16px on mobile, 56px on desktop
          pr: { xs: 2, md: 2 }, // padding-right: 16px
          mt: "80px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Left Column: ProfileCard + ListCard */}
        <Stack
  spacing={3}
  sx={{
    flexShrink: 0,
    width: { xs: "100%", md: "300px" },
    alignItems: { xs: "center", md: "flex-start" }, // center on mobile, left on desktop
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


        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "700px" }}>
            <Stack spacing={3}>
              <JobPreferences />
              <JobList />
              <Recommends/>
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Home;
