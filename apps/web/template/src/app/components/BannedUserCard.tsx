"use client";

import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
} from "@mui/material";

export default function BannedUserCard({
  ban,
  onUnban,
}: {
  ban: any;
  onUnban: (userId: number) => void;
}) {
  return (
    <Card sx={{ display: "flex", p: 2 }}>
      {ban.user_profile.profile_picture_url && (
        <CardMedia
          component="img"
          image={ban.user_profile.profile_picture_url}
          alt={ban.user_profile.first_name || "user profile picture"}
          sx={{ width: 60, height: 60, borderRadius: 2 }}
        />
      )}

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {ban.user_profile.first_name} {ban.user_profile.last_name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {ban.user_profile.contact_info.email}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Banned on: {new Date(ban.created_at).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Reason:</strong> {ban.reason}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onUnban(ban.user_id)}
          sx={{ mt: 1 }}
        >
          Unban User
        </Button>
      </CardContent>
    </Card>
  );
}
