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
import { useEffect, useState } from "react";
import ReceivedInviteCard from "./ReceivedInviteCard";
import SentInviteCard from "./SentInviteCard";
import { useConnectionStore } from "../stores/useConnectionStore";

// Utility: Format "x days ago"
function formatTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

const ManageInvitationsCard = () => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const {
    fetchReceivedInvitations,
    fetchSentInvitations,
    receivedInvitations,
    sentInvitations,
    respondToConnectionRequest
  } = useConnectionStore();

  useEffect(() => {
    if (tab === 0) fetchReceivedInvitations();
    if (tab === 1) fetchSentInvitations();
  }, [tab]);

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
      {/* Header */}
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

      {/* Tab: Received */}
      {tab === 0 && (
        <>
          {receivedInvitations.map((invite) => (
            <Box key={invite.id} mb={2}>
              <ReceivedInviteCard
                fullName={`${invite.first_name} ${invite.last_name}`}
                message={invite.message}
                time={formatTimeAgo(invite.created_at)}
                profilePicture={
                  invite.profile_picture_id
                    ? `https://api.ascendx.tech/files/${invite.profile_picture_id}`
                    : undefined
                }
                onAccept={() => respondToConnectionRequest(invite.id, true)}
                onIgnore={() => respondToConnectionRequest(invite.id, false)}
              />
            </Box>
          ))}
        </>
      )}

      {/* Tab: Sent */}
      {tab === 1 && (
        <>
          {sentInvitations.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No sent invitations yet.
            </Typography>
          ) : (
            sentInvitations.map((invite) => (
              <Box key={invite.id} mb={2}>
                <SentInviteCard
                  fullName={`${invite.first_name} ${invite.last_name}`}
                  message={invite.message}
                  time={formatTimeAgo(invite.created_at)}
                  profilePicture={
                    invite.profile_picture_id
                      ? `https://api.ascendx.tech/files/${invite.profile_picture_id}`
                      : undefined
                  }
                />
              </Box>
            ))
          )}
        </>
      )}
    </Box>
  );
};

export default ManageInvitationsCard;
