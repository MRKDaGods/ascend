"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Paper, TextField } from "@mui/material";
import BackButton from "@/app/components/BackButton";

export default function ProvideMoreInfo() {
  const [feedback, setFeedback] = useState("");
  const router = useRouter();


  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", mt: -10, ml:25 }}>
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
          Please provide a little more information to help us improve
        </Typography>

        {/* Text Input Field */}
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          Reason for closing account
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        {/* Next Button - Aligned to Left */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              borderRadius: "20px",
              padding: "6px 16px",
            }}
            onClick={() => router.push("/CloseAccountPassword")}

          >
            Next
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
