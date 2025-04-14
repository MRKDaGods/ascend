"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BackButton from "./BackButton";

export default function CloseAccount({ username }: { username: string }) {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: "600px",
          width: "100%",
          p: 3,
          borderRadius: "8px",
        }}
      >
        {/* Back Button */}
        <BackButton />

        {/* Close Account Content */}
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.2rem", mb: 1 }}>
          Close account
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {username}, we’re sorry to see you go
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Are you sure you want to close your account? You’ll lose your connections, messages, endorsements, and recommendations.
        </Typography>

        {/* Continue Button (Smaller, Rounded, Aligned Left) */}
        <Button
          id="continue-button"
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            fontSize: "0.875rem",
            borderRadius: "20px",
            padding: "6px 16px",
          }}
          onClick={() => router.push("/ReasonToClose")}
        >
          Continue
        </Button>
      </Paper>
    </Box>
  );
}
