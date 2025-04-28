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
      flexWrap="wrap"
      width="100%"
      px={2}
      py={3}
      gap={2}
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        borderTop: `1px solid ${theme.palette.divider}`,
        fontSize: "0.75rem",
      }}
    >
      {/* Logo and Year */}
      <Box display="flex" alignItems="center" gap={0.5}>
        <Box
          sx={{
            backgroundColor: theme.palette.grey[700],
            color: theme.palette.getContrastText(theme.palette.grey[700]),
            px: 0.5,
            py: 0.2,
            borderRadius: 1,
            fontSize: "0.75rem",
            fontWeight: 500,
          }}
        >
          Ascend
        </Box>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
          © 2025
        </Typography>
      </Box>

      {/* Divider Dot (optional, like LinkedIn style) */}
      {/* <Typography variant="caption" sx={{ mx: 1 }}>•</Typography> */}

      {/* Footer Links */}
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
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </Link>
      ))}

      {/* Language Selector */}
      <Typography
        id="language-selector"
        variant="caption"
        sx={{
          cursor: "pointer",
          fontSize: "0.75rem",
          color: theme.palette.text.secondary,
          whiteSpace: "nowrap",
        }}
      >
        Language
      </Typography>
    </Box>
  );
};

export default Footer;
