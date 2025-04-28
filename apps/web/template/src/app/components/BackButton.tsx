'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
  const router = useRouter();

  return (
    <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
      <ArrowBackIcon />
      <Typography variant="h6" component="span" sx={{ ml: 1 }}>
        Back
      </Typography>
    </IconButton>
  );
};

export default BackButton;
