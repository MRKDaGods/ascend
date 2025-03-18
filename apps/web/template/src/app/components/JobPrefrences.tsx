"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, Button, IconButton, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

const JobPreferences = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Ensures rendering consistency between SSR & CSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isVisible) return null;

  return (
    <Card
      sx={{
        maxWidth: 700,
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          Are you looking for a new job?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
          Add your preferences to find relevant jobs and get notified about new open roles.
        </Typography>

        {/* Rounded Buttons */}
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "20px",
              px: 2.5,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Actively looking
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: "20px",
              px: 2,
              py: 0.25,
              fontWeight: 600,
              textTransform: "none",
              borderWidth: "2px",
            }}
          >
            Casually browsing
          </Button>
        </Box>
      </CardContent>

      {/* Image (Only Rendered on Client) */}
      {isClient && (
        <Box>
          <Image src="/jobsPrefrences.svg" alt="Job Preferences" width={80} height={80} />
        </Box>
      )}

      {/* Close Button */}
      <IconButton onClick={() => setIsVisible(false)}>
        <CloseIcon />
      </IconButton>
    </Card>
  );
};

export default JobPreferences;
