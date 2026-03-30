"use client";

import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

interface SentInviteCardProps {
  fullName: string;
  message: string;
  time: string;
  profilePicture?: string;
  onWithdraw?: () => void;
}

const SentInviteCard = ({
  fullName,
  message,
  time,
  profilePicture,
  onWithdraw,
}: SentInviteCardProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        width: "100%",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={profilePicture || ""} sx={{ width: 48, height: 48 }} />
        <Box>
          <Typography fontWeight={600}>{fullName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Sent {time}
          </Typography>
        </Box>
      </Stack>

      <Button
        size="small"
        onClick={onWithdraw}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          color: theme.palette.primary.main,
        }}
      >
        Withdraw
      </Button>
    </Box>
  );
};

export default SentInviteCard;
