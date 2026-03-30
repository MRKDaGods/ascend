"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Paper, TextField, Checkbox, FormControlLabel } from "@mui/material";
import BackButton from "@/app/components/BackButton";

export default function CloseAccountPassword() {
  const [password, setPassword] = useState("");
  const [unsubscribe, setUnsubscribe] = useState(false);
  const router = useRouter();

  return (
    <Box
      id="close-account-password-page"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", mt: -10, ml: 25 }}
    >
      <Paper
        id="close-account-password-container"
        elevation={3}
        sx={{
          maxWidth: "55%",
          width: "100%",
          p: 3,
          borderRadius: "8px",
        }}
      >
        <BackButton />

        <Typography id="close-account-password-title" variant="h6" fontWeight="bold" sx={{ fontSize: "1.2rem", mb: 1 }}>
          Close account
        </Typography>
        <Typography id="close-account-password-message" variant="body1" sx={{ mb: 2 }}>
          Enter your password to close this account
        </Typography>

        <TextField
          id="close-account-password-input"
          label="Password"
          InputLabelProps={{
            style: { display: "none" },
          }}
          fullWidth
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            "& .MuiInputBase-root": { height: "2.5em", border: "0.01em solid black" },
          }}
        />

        <FormControlLabel
          id="close-account-unsubscribe-checkbox"
          control={
            <Checkbox
              id="unsubscribe-checkbox"
              checked={unsubscribe}
              onChange={(e) => setUnsubscribe(e.target.checked)}
            />
          }
          label="Unsubscribe me from Ascend email communications, including invitations."
        />

        <Box id="close-account-password-actions" sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
          <Button
            id="close-account-done-button"
            variant="contained"
            color="primary"
            disabled={!password}
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              borderRadius: "20px",
              padding: "6px 16px",
              backgroundColor: password ? "#0073b1" : "#e0e0e0",
              color: password ? "white" : "#9e9e9e",
            }}
            onClick={() => router.push("/")}
          >
            Done
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
