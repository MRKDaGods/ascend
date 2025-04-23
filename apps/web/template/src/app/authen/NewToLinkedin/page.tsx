"use client";

import React from "react";
import SignUp from "@/app/components/SignUp";
import Logo from "@/app/components/Logo";
import { Box, Container } from "@mui/material";
import LightThemeProvider from "@/app/providers/LightThemeProvider";

const Page = () => {
  return (
    <LightThemeProvider>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Logo />
        <Container>
          <SignUp />
        </Container>
      </Box>
    </LightThemeProvider>
  );
};

export default Page;
