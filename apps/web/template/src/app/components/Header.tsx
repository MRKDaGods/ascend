"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Header = () => {
  const router = useRouter();

  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: { xs: "100%", md: "80%" },
          mx: { xs: 2, md: "10em" },
          px: { xs: 2, md: 0 },
          py: { xs: 1, md: 0 },
        }}
      >
        <Typography variant="h5" color="primary" fontWeight="bold" id="linkedin-logo">
          Linked<span style={{ backgroundColor: "#0077b5", color: "white", padding: "0.01em 0.2em", borderRadius: 4 }}>in</span>
        </Typography>

        <Box sx={{ display: "flex", gap: { xs: 1, md: 2 } }}>
          <Button
            id="join-now-button"
            onClick={() => router.push("/signInWithEmail")}
            sx={{ color: "black", textTransform: "none", fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
            Join now
          </Button>
          <Button
            id="sign-in-button"
            onClick={() => router.push("/signup")}
            variant="outlined"
            sx={{
              borderRadius: 50,
              textTransform: "none",
              fontSize: { xs: "0.875rem", md: "1rem" },
              px: { xs: 1.5, md: 2 },
            }}
          >
            Sign in
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
