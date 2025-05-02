// Page: Main Network

"use client";

import React from "react";
import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Navbar from "../components/Navbar";
import WhosHiringCard from "../components/WhosHiringCard";
import Footer from "../components/Footer";
import ManageNetworkCard from "../components/ManageNetworkCard";
import InvitationsCard from "../components/InvitationsCard";
import PremiumAdCard from "../components/PremiumAdCard";

const NetworkPage: React.FC = () => {
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

      <Container
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          px: { xs: 1, sm: 2 },
          maxWidth: "1400px",
        }}
      >
        {/* Left Panel (Manage Network) */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "350px" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: { md: "sticky" },
            top: { md: "80px" },
            alignSelf: "flex-start",
          }}
        >
          <ManageNetworkCard />
          <WhosHiringCard />
          <Footer />
        </Box>

        {/* Center Panel (Main Content) */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "600px" }}>
          <InvitationsCard />
          <br></br>
          <PremiumAdCard />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NetworkPage;
