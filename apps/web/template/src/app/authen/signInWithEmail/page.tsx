"use client";

import React from "react";
import { Box } from "@mui/material";
import SigninHeader from "@/app/components/SigninHeader";
import SigninBox from "@/app/components/SigninBox";
import Footer from "@/app/components/Footer";
import LightThemeProvider from "@/app/providers/LightThemeProvider";

const SigninPage = () => {
  return (
    <LightThemeProvider>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="90vh"
        bgcolor="background.default"
      >
        <SigninHeader />
        <SigninBox />
      </Box>
      <Footer />
    </LightThemeProvider>
  );
};

export default SigninPage;
