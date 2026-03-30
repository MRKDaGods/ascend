// pages/hire.tsx

'use client';

import { Box, useTheme } from "@mui/material";
import HireCard from "../../components/HireCard";
import MergeJobsNavbar from "@/app/components/MergeJobsNavbar";

export default function HirePage() {
  const theme = useTheme();

  return (
    <>
      <MergeJobsNavbar />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          pt: { xs: 8, sm: 10 },
          pb: 6,
        }}
      >
        <HireCard />
      </Box>
    </>
  );
}
