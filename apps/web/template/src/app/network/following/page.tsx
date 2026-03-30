"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Navbar from "../../components/Navbar";
import MyFollowers from "../../components/MyFollowers";
import PremiumAdCard from "../../components/PremiumAdCard";
import Footer from "../../components/Footer";
import SidebarPreview from "../../components/SidebarPreview";

const FollowingPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Navbar />
      <SidebarPreview />

      <Container
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 3,
          px: { xs: 1, sm: 2 },
          maxWidth: "1400px",
        }}
      >
        {/* Left Panel: Invitations Card */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "640px" },
          }}
        >
          {/* <FollowersList /> */}
          <MyFollowers />
        </Box>

        {/* Right Panel: Premium Ad */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "280px" },
            position: { md: "sticky" },
            top: { md: "80px" },
          }}
        >
          <PremiumAdCard />
          <Footer />
        </Box>
      </Container>
    </Box>
  );
};

export default FollowingPage;
