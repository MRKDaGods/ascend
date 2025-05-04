"use client";

import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import { useConnectionStore } from "@/app/stores/useConnectionStore";
import { formatDistanceToNowStrict } from "date-fns";

export default function BlockedUsers() {
  const { blockedUsers, fetchBlockedUsers, unblockUser } = useConnectionStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const handleOpenDialog = (userId: number) => {
    setSelectedUserId(userId);
    setDialogOpen(true);
  };

  const handleUnblock = async () => {
    if (selectedUserId !== null) {
      await unblockUser(selectedUserId);
      await fetchBlockedUsers();
      setDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  return (
    <>
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
              onClick={() => handleOpenDialog(user.user_id)}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography>
            You will not be able to reblock this member for 48 hours after
            unblocking.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={() => setDialogOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleUnblock}>
            Unblock member
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
