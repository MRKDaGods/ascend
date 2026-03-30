"use client";

import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

interface ReceivedInviteCardProps {
  fullName: string;
  message: string;
  time: string;
  profilePicture?: string;
  onAccept: () => void;
  onIgnore: () => void;
}

const ReceivedInviteCard = ({
  fullName,
  message,
  time,
  profilePicture,
  onAccept,
  onIgnore,
}: ReceivedInviteCardProps) => {
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
      {/* Left side: avatar and text */}
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

      {/* Right side: action buttons */}
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={onIgnore}
          sx={{
            color: theme.palette.text.secondary,
            border: "0px",
            textTransform: "none",
          }}
        >
          Ignore
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={onAccept}
          sx={{
            textTransform: "none",
          }}
        >
          Accept
        </Button>
      </Stack>
    </Box>
  );
};

export default ReceivedInviteCard;
