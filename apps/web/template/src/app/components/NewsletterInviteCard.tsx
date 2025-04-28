"use client";

import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";

const NewsletterInviteCard = () => {
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
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box sx={{ position: "relative" }}>
          <Avatar
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Intel_Logo.svg/2048px-Intel_Logo.svg.png"
            sx={{ width: 48, height: 48 }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -2,
              right: -2,
              bgcolor: theme.palette.background.paper,
              borderRadius: "50%",
              p: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <NewspaperIcon fontSize="small" />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Newsletter • Monthly
          </Typography>
          <Typography>
            <strong>Intel Corporation</strong> invited you to subscribe to{" "}
            <strong>Intel IQ</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" mt={0.5}>
            1 month ago
          </Typography>
        </Box>
      </Stack>

     <Stack direction="row" spacing={1}>
      <Button variant="outlined" size="small" 
      sx={{
          color: theme.palette.text.secondary,
          cursor: "pointer",
          border: "0px",
        }}>
        Ignore
      </Button>
      <Button variant="outlined" size="small">
        Accept
      </Button>
    </Stack>
    </Box>
  );
};

export default NewsletterInviteCard;
