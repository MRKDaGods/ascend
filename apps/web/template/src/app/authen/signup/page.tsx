"use client";

import LoginBox from "@/app/components/LoginBox";
import Logo from "@/app/components/Logo";
import LightThemeProvider from "@/app/providers/LightThemeProvider";
import { Box } from "@mui/material";

export default function LoginPage() {
  return (
    <LightThemeProvider>
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="background.default"
      >
        <Logo />
        <LoginBox />
      </Box>
    </LightThemeProvider>
  );
}
