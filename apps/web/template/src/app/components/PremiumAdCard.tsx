"use client";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const PremiumAdCard = () => {
  const theme = useTheme();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        width: "100%",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        position: "relative",
      }}
    >
      {/* Close Button */}
      <IconButton
        size="small"
        onClick={() => setVisible(false)}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
        Grow your network with Premium
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={1}>
        Applicants are <strong>7x more likely</strong> to get hired with a
        referral.
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Stack direction="row" spacing={-1}>
          <Avatar
            src="https://randomuser.me/api/portraits/women/65.jpg"
            sx={{ width: 24, height: 24, border: "2px solid white" }}
          />
          <Avatar
            src="https://randomuser.me/api/portraits/men/44.jpg"
            sx={{ width: 24, height: 24, border: "2px solid white" }}
          />
          <Avatar
            src="https://randomuser.me/api/portraits/women/22.jpg"
            sx={{ width: 24, height: 24, border: "2px solid white" }}
          />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Millions of members use Premium
        </Typography>
      </Stack>

      <Button
        variant="contained"
        size="small"
        sx={{
          bgcolor: "#FFC107",
          color: "#000",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 20,
          px: 2,
          mb: 1,
          "&:hover": { bgcolor: "#D4AF37" },
        }}
      >
        Try Premium for EGP0
      </Button>

      <Typography variant="caption" color="text.secondary">
        1-month free trial. Cancel anytime.
      </Typography>
    </Box>
  );
};

export default PremiumAdCard;
