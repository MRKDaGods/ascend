"use client";

import React from "react";
import { Box, useTheme } from "@mui/material";
import Navbar from "@/app/components/Navbar";
import PremiumPage from "@/app/components/PremiumPage";

export default function Page() {
  const theme = useTheme();

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          pt: { xs: 8, sm: 10 },
          pb: 6,
        }}
      >
        <PremiumPage />
      </Box>
    </>
  );
}
