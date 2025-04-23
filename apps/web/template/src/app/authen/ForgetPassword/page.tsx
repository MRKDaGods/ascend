"use client";

import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ForgotPasswordForm from "@/app/components/ForgotPasswordForm";
import { Box, Container } from "@mui/material";
import LightThemeProvider from "@/app/providers/LightThemeProvider";

const ForgotPassword = () => {
  return (
    <LightThemeProvider>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        justifyContent="space-between"
        bgcolor="background.default"
      >
        <Header />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <ForgotPasswordForm />
        </Container>
        <Footer />
      </Box>
    </LightThemeProvider>
  );
};

export default ForgotPassword;
