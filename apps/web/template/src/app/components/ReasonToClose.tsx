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
      router.push("/authen/ProvideMoreInfo"); // Route to ProvideMoreInfo page
    } else {
      router.push("/authen/CloseAccountPassword"); // Route elsewhere
    }
  };

  return (
    <Box
      id="reason-to-close-container"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", mt: 27 }}
    >
      <Paper
        id="reason-to-close-paper"
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
        <Typography
          id="reason-to-close-title"
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: "1.2rem", mb: 1 }}
        >
          Close account
        </Typography>
        <Typography id="reason-to-close-username-message" variant="body1" sx={{ mb: 2 }}>
          {username}, we’re sorry to see you go
        </Typography>

        {/* Reason Selection Component */}
        <ReasonSelection
          selectedReason={selectedReason}
          setSelectedReason={setSelectedReason}
        />

        {/* Next Button - Aligned to Left */}
        <Box id="reason-to-close-next-button-container" sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
          <Button
            id="reason-to-close-next-button"
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
