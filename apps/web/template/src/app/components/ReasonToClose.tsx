"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Paper } from "@mui/material";
import BackButton from "./BackButton";
import ReasonSelection from "./ReasonSelection";

export default function ReasonToClose({ username }: { username: string }) {
  const [selectedReason, setSelectedReason] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (selectedReason === "Other") {
      router.push("/ProvideMoreInfo"); // Route to ProvideMoreInfo page
    } else {
      router.push("/CloseAccountPassword"); // Route elsewhere
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", mt: 27 }}>
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
        <Typography variant="h6" id="close-account-title" fontWeight="bold" sx={{ fontSize: "1.2rem", mb: 1 }}>
          Close account
        </Typography>
        <Typography variant="body1" id="username-message" sx={{ mb: 2 }}>
          {username}, we’re sorry to see you go
        </Typography>

        {/* Reason Selection Component */}
        <ReasonSelection selectedReason={selectedReason} setSelectedReason={setSelectedReason} />

        {/* Next Button - Aligned to Left */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
          <Button
            id="next-button"
            variant="contained"
            color="primary"
            onClick={handleNext}
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              borderRadius: "20px",
              padding: "6px 16px",
            }}
          >
            Next
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
