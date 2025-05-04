// // Page: Main Feed

// "use client";

// import React, { useEffect } from "react";
// import { Box, Container, CircularProgress, Divider } from "@mui/material";
// import { useTheme } from "@mui/material/styles";

// import Navbar from "../components/Navbar";
// import CreatePost from "../components/CreatePost";
// import ConnectionPost from "../components/ConnectionPost";
// import FeedbackAcknowledgement from "../components/FeedbackAcknowledgement";
// import ProfileCard from "../components/ProfileCard";
// import WhosHiringCard from "../components/WhosHiringCard";
// import Footer from "../components/Footer";
// import TryPremCard from "../components/TryPremCard";
// import ManageFeedCard from "../components/ManageFeedCard";

// import { usePostStore } from "../stores/usePostStore";
// import { useProfileStore } from "../stores/useProfileStore";

// import {api} from "@/api/";
// import SidebarPreview from "../components/SidebarPreview";

"use client";

import React, { useEffect } from "react";
import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Navbar from "@/app/components/Navbar";
import SavedPosts from "@/app/components/SavedPosts";
import WhosHiringCard from "@/app/components/WhosHiringCard";
import Footer from "@/app/components/Footer";

import { usePostStore } from "@/app/stores/usePostStore";

const SavePage: React.FC = () => {
  const theme = useTheme();
  const { fetchSavedPostsAPI } = usePostStore();

  useEffect(() => {
    fetchSavedPostsAPI();
  }, [fetchSavedPostsAPI]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Navbar />

      <Container
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: { xs: "stretch", md: "flex-start" },
          gap: 3,
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
            gap: 2,
            position: { md: "sticky" },
            top: { md: "80px" },
            alignSelf: "flex-start",
          }}
        >
          <></>
        </Box>

        {/* Center Feed */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            top: { md: "80px" },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "600px" }}>
            <SavedPosts />
          </Box>
        </Box>

        {/* Right Panel */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "300px" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: { md: "sticky" },
            top: { md: "80px" },
            alignSelf: "flex-start",
          }}
        >
          <WhosHiringCard />
          <Footer />
        </Box>
      </Container>
    </Box>
  );
};

export default SavePage;
