import { Card, CardContent, Typography, Link } from "@mui/material";

export default function SettingsCard() {
  return (
    <Card
      sx={{
        maxWidth: 320, // Match the screenshot size
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "white",
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
