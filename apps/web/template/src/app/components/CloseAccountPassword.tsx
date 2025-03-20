"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Paper, TextField, Checkbox, FormControlLabel } from "@mui/material";
import BackButton from "@/app/components/BackButton";

export default function CloseAccountPassword() {
  const [password, setPassword] = useState("");
  const [unsubscribe, setUnsubscribe] = useState(false);
    const router = useRouter();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", mt: -10, ml:25 }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: "55%",
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
          Enter your password to close this account
        </Typography>

        {/* Password Field */}
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          Password
        </Typography>
        <TextField
          fullWidth
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{height: "2em", "& .MuiInputBase-root": { height: "2em",  border: "0.01em solid black"  } }}
          
        />

        {/* Unsubscribe Checkbox */}
        <FormControlLabel
          control={<Checkbox checked={unsubscribe} onChange={(e) => setUnsubscribe(e.target.checked)} />}
          label="Unsubscribe me from LinkedIn email communications, including invitations."
        />

        {/* Done Button - Disabled if no password entered */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 3 }}>
          <Button
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
