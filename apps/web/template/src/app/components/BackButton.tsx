"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      id="back-button"
      startIcon={<ArrowBackIcon data-testid="ArrowBackIcon" />}
      onClick={() => router.back()}
      sx={{ textTransform: "none", fontWeight: "bold", mb: 2 }}
    >
      Back
    </Button>
  );
};

export default BackButton;
