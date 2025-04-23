"use client";

import React from "react";
import Image from "next/image";
import { Box, useTheme } from "@mui/material";

const LoadingPage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      {/* Logo */}
      <Image
        src="/ourlogo.png"
        alt="Loading logo"
        width={160}
        height={50}
        priority
        style={{ objectFit: "contain" }}
      />

      {/* Loading Bar Container */}
      <Box
        sx={{
          width: 140,
          height: 3,
          backgroundColor: theme.palette.grey[300],
          overflow: "hidden",
          position: "relative",
          borderRadius: 2,
        }}
      >
        {/* Animated Blue Bar */}
        <Box
          sx={{
            width: 40,
            height: "100%",
            backgroundColor: theme.palette.primary.main,
            position: "absolute",
            animation: "moveBar 1.2s ease-in-out infinite",
          }}
        />
      </Box>

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes moveBar {
          0% {
            left: -40px;
          }
          50% {
            left: 100px;
          }
          100% {
            left: -40px;
          }
        }
      `}</style>
    </Box>
  );
};

export default LoadingPage;
