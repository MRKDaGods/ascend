"use client";

import React, { useEffect } from "react";
import { Paper, Typography, Box, Avatar, Icon, Button } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import { useConnectionStore } from "@/app/stores/useConnectionStore";
import { formatDistanceToNowStrict } from "date-fns";

export default function BlockedUsers() {
  const { blockedUsers, fetchBlockedUsers, unblockUser } = useConnectionStore();

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const handleUnblock = async (userId: number) => {
    await unblockUser(userId);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={600}>
        Blocking
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        You’re currently blocking {blockedUsers.length}{" "}
        {blockedUsers.length === 1 ? "person" : "people"}
      </Typography>

      {blockedUsers.map((user) => (
        <Box
          key={user.user_id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <BlockIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Avatar
              src={
                user.profile_picture_id
                  ? `/api/media/${user.profile_picture_id}`
                  : "/default-avatar.png"
              }
              sx={{ width: 36, height: 36 }}
            />
            <Box>
              <Typography fontWeight={500}>
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNowStrict(new Date(user.blocked_at), {
                  addSuffix: true,
                })}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="text"
            size="small"
            onClick={() => handleUnblock(user.user_id)}
            sx={{
              color: "#0a66c2",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Unblock
          </Button>
        </Box>
      ))}
    </Paper>
  );
}
