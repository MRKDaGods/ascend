"use client";

import { useEffect, useState } from "react";
import { Box, Container, CircularProgress } from "@mui/material";

export default function Home() {


  return (
    <Box
  sx={{
    minHeight: "100vh",
    bgcolor: "grey.100",
    display: "flex",
    flexDirection: "column",
  }}
>
      {/* Main Layout */}
      <Container
       sx={{
        flexGrow: 1,
        mt: 10,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        maxWidth: "1200px",
        pb: 3,
      }}
      >
        <p>Hello Nour!</p>
      </Container>

    </Box>
  );
}