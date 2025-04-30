"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Link, useTheme } from "@mui/material";
import AuthButtons from "./AuthButtons";

const AuthSection = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        textAlign: "left",
        position: "relative",
        top: "7em",
        color: theme.palette.text.primary,
      }}
    >
      <Typography
        variant="h4"
        color="text.secondary"
        gutterBottom
        sx={{
          maxWidth: 700,
          fontSize: "clamp(2rem, 5vw, 3rem)",
          color: theme.palette.text.secondary,
        }}
      >
        Welcome to your professional community
      </Typography>

      <AuthButtons />

      <Typography
        variant="body2"
        color="text.secondary"
        mt={2}
        sx={{
          textAlign: "center",
          position: "relative",
          maxWidth: 400,
          color: theme.palette.text.secondary,
        }}
      >
        By clicking Continue to join or sign in, you agree to Ascend's
        <Link href="#" id="user-agreement-link" sx={{ ml: 0.5 }}>
          User Agreement
        </Link>
        ,<Link href="#" id="privacy-policy-link" sx={{ ml: 0.5 }}>
          Privacy Policy
        </Link>
        , and
        <Link href="#" id="cookie-policy-link" sx={{ ml: 0.5 }}>
          Cookie Policy
        </Link>
        .
      </Typography>

      <Typography
        mt={2}
        sx={{
          textAlign: "center",
          position: "relative",
          maxWidth: 400,
          color: theme.palette.text.primary,
        }}
      >
        New to Ascend?{" "}
        <Link
          href="#"
          id="join-now-link"
          onClick={() => router.push("/authen/NewToLinkedin")}
        >
          Join now
        </Link>
      </Typography>
    </Box>
  );
};

export default AuthSection;
