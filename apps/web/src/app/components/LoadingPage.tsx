"use client";

import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const LoadingPage = () => {
  const theme = useTheme();
  const router = useRouter();

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
      {/* Logo Section */}
      <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
        <img
          src="/logoIcon.png"
          alt="Ascend"
          style={{ height: 36, borderRadius: 6 }}
        />
        <Box
          onClick={() => router.push("/feed")}
          sx={{ cursor: "pointer" }} // Add pointer cursor to indicate it's clickable
        >
          <Typography variant="h5" color="primary" fontWeight="bold">
            Ascend
          </Typography>
        </Box>
      </Box>

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