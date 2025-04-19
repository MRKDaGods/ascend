import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ForgotPasswordForm from "@/app/components/ForgotPasswordForm";
import { Box, Container } from "@mui/material";

const ForgotPassword = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="space-between" bgcolor="background.default">
      <Header />
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
        <ForgotPasswordForm />
      </Container>
      <Footer />
    </Box>
  );
};

export default ForgotPassword;
