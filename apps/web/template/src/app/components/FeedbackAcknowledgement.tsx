"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const FeedbackAcknowledgement: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        mt: 1,
      }}
    >
      <Typography fontWeight="bold" variant="body1">
        Thanks for letting us know
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Your feedback helps improve the feed
      </Typography>
    </Box>
  );
};

export default FeedbackAcknowledgement;
