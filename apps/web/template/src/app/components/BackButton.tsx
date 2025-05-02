'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
  const router = useRouter();

  return (
    <IconButton id="back-button" onClick={() => router.back()} sx={{ mr: 2 }}>
      <ArrowBackIcon id="back-button-icon" />
      <Typography id="back-button-text" variant="h6" component="span" sx={{ ml: 1 }}>
        Back
      </Typography>
    </IconButton>
  );
};

export default BackButton;
