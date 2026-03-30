"use client";

import React from "react";
import SignUp from "@/app/components/SignUp";
import { Box, Container, Typography } from "@mui/material";
import LightThemeProvider from "@/app/providers/LightThemeProvider";
import Footer from "@/app/components/Footer";

const Page = () => {
  return (
    <LightThemeProvider>
      <Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: 4 }}>
        <Box ml={35} sx={{ display: "flex" }}>
          <img
          src="/logoIcon.png"
          alt="Ascend"
          style={{ height: 36, borderRadius: 6 }}
        />
        <Typography variant="h5" color="primary" fontWeight="bold">Ascend</Typography>
        </Box>
        <Container>
          <SignUp />
        </Container>
      </Box>
      <Footer />
    </LightThemeProvider>
  );
};

export default Page;
