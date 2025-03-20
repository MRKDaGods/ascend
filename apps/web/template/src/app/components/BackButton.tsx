"use client";

import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton() {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", mb: 2 }} onClick={() => router.back()}>
      <ArrowBackIcon sx={{ fontSize: 20, color: "black" }} />
      <Typography sx={{ ml: 1, fontSize: "0.875rem", fontWeight: "bold", color: "black", textTransform: "none" }}>
        Back
      </Typography>
    </Box>
  );
}
