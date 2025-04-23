"use client";

import { Card, CardContent, Typography, Link, useTheme } from "@mui/material";

export default function SettingsCard() {
  const theme = useTheme();

  return (
    <Card
      sx={{
        maxWidth: 400,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: theme.palette.background.paper, // ✅ Theme-aware background
        color: theme.palette.text.primary,       // ✅ Theme-aware text
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography variant="body1" fontWeight="bold" gutterBottom>
          Manage your notifications
        </Typography>
        <Link href="#" variant="body2" color="primary">
          View settings
        </Link>
      </CardContent>
    </Card>
  );
}
