"use client";

import LoginBox from "@/app/components/LoginBox";
import LightThemeProvider from "@/app/providers/LightThemeProvider";
import Footer from "@/app/components/Footer";
import { Box, Typography } from "@mui/material";

export default function LoginPage() {
  return (
    <LightThemeProvider>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="90vh"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="background.default"
      >
        <Box mt={2} sx={{ display: "flex", gap: { xs: 1, md: 2 } }}>
          <img
          src="/logoIcon.png"
          alt="Ascend"
          style={{ height: 36, borderRadius: 6 }}
        />
        <Typography variant="h5" color="primary" fontWeight="bold">Ascend</Typography>
        </Box>
        <LoginBox />
      </Box>
      <Footer />
    </LightThemeProvider>
  );
}
