"use client";

import {
  Box,
  Typography,
  useTheme,
  Avatar,
  Stack,
  Button,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useConnectionStore } from "../stores/useConnectionStore";

const MessageRequests = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { messageRequests, fetchMessageRequests } = useConnectionStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      await fetchMessageRequests();
      setLoading(false);
    };
    loadRequests();
  }, []);

  const handleMenuOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    setAnchorEl(e.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleDelete = () => {
    // Optional: implement delete logic
    handleMenuClose();
  };

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
      <Typography variant="h6" fontWeight={600} mb={2}>
        Message Requests
      </Typography>

      {loading ? (
        <Box py={4} textAlign="center">
          <CircularProgress />
        </Box>
      ) : messageRequests.length ? (
        messageRequests.map((req) => (
          <Box key={req.id} mb={2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={
                    req.profile_picture_id
                      ? `https://api.ascendx.tech/files/${req.profile_picture_id}`
                      : ""
                  }
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography fontWeight={600}>
                    {req.first_name} {req.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {req.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Requested on {new Date(req.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>

              <IconButton onClick={(e) => handleMenuOpen(e, req.id)}>
                <MoreHorizIcon />
              </IconButton>
            </Stack>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          py={3}
        >
          No message requests found.
        </Typography>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete request
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MessageRequests;
