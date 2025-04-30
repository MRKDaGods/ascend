// Page: Main Feed

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
          <SavedPosts />
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
