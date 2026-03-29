"use client";

import {
  Box,
  Tab,
  Tabs,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import NewsletterInviteCard from "./NewsletterInviteCard";

const ManageInvitationsCard = () => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState("all");

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        width: "100%",
      }}
    >
      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Manage invitations
        </Typography>
        <IconButton size="small">
          <SettingsIcon />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{ mb: 1 }}
      >
        <Tab label="Received" />
        <Tab label="Sent" />
      </Tabs>

      {/* Filter Pills */}
      {tab === 0 && (
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        </Box>
      )}

      {/* Content */}
      {tab === 0 && <NewsletterInviteCard />}
      {tab === 1 && (
        <Typography variant="body2" color="text.secondary">
          No sent invitations yet.
        </Typography>
      )}
    </Box>
  );
};

export default ManageInvitationsCard;
