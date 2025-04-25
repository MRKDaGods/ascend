"use client";

import { Card, CardContent, Typography, Link, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SettingsCard() {
  const router = useRouter();
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
        <Link href="#" variant="body2" color="primary" onClick={() => router.push("/authen/Settings")}>
          View settings
        </Link>
      </CardContent>
    </Card>
  );
}
