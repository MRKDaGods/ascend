"use client";

import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={1}
      flexWrap="wrap"
      px={2}
      py={3}
      width="100%"
      zIndex={1}
      sx={{
        mt: 4,
        textAlign: "center",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Logo Text */}
      <Typography variant="caption" sx={{ color: theme.palette.text.primary }}>
        <strong>Ascend</strong>
        <span
          style={{
            backgroundColor: theme.palette.grey[700],
            color: theme.palette.getContrastText(theme.palette.grey[700]),
            padding: "0.01em 0.2em",
            borderRadius: 4,
            marginLeft: "0.15em",
          }}
        >
          in
        </span>{" "}
        © 2025
      </Typography>

      {/* Footer Links */}
      <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1.5}>
        {[
          ["User Agreement", "#user-agreement-link"],
          ["Privacy Policy", "#privacy-policy-link"],
          ["Community Guidelines", "#community-guidelines-link"],
          ["Cookie Policy", "#cookie-policy-link"],
          ["Copyright Policy", "#copyright-policy-link"],
          ["Send Feedback", "#send-feedback-link"],
        ].map(([text, id]) => (
          <Link
            key={id}
            href="#"
            id={id.slice(1)}
            underline="hover"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.75rem",
            }}
          >
            {text}
          </Link>
        ))}
      </Box>

      {/* Language Selector */}
      <Typography
        id="language-selector"
        variant="caption"
        sx={{
          cursor: "pointer",
          fontSize: "0.75rem",
          mt: 1,
          color: theme.palette.text.secondary,
        }}
      >
        Language ⌄
      </Typography>
    </Box>
  );
};

export default Footer;
