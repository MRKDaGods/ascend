"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Header = () => {
  const router = useRouter();

  return (
    <AppBar id="header-app-bar" position="static" color="inherit" elevation={0}>
      <Toolbar
        id="header-toolbar"
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
        <Box id="header-logo-container" sx={{ display: "flex", gap: { xs: 1, md: 2 } }}>
          <img
            id="header-logo"
            src="/logoIcon.png"
            alt="Ascend"
            style={{ height: 36, borderRadius: 6 }}
          />
          <Typography id="header-title" variant="h5" color="primary" fontWeight="bold">
            Ascend
          </Typography>
        </Box>

        <Box id="header-buttons-container" sx={{ display: "flex", gap: { xs: 1, md: 2 } }}>
          <Button
            id="join-now-button"
            onClick={() => router.push("/authen/signInWithEmail")}
            sx={{ color: "black", textTransform: "none", fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
            Join now
          </Button>
          <Button
            id="sign-in-button"
            onClick={() => router.push("/authen/signup")}
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
