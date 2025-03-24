"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVert, Notifications, Delete, VisibilityOff } from "@mui/icons-material";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
  Divider,
  Button,
  ButtonGroup,
} from "@mui/material";
import { useNotificationStore } from "../store/useNotificationStore";

const NotificationCard: React.FC = () => {
  const { notifications, markAsRead, deleteNotification } = useNotificationStore();
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: null | HTMLElement }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [filterType, setFilterType] = useState("all");

  const unseenCount = notifications.filter((notif) => !notif.markedasread).length;

  // 🔹 Filtering Notifications Based on Type
  const filteredNotifications = notifications.filter((notification) => {
    if (filterType === "myposts") return ["like", "comment"].includes(notification.type);
    if (filterType === "mentions") return notification.type === "mention";
    if (filterType === "connections") return notification.type === "follow";
    return true; // "all" filter
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl({ [id]: event.currentTarget });
  };

  const handleMenuClose = () => {
    setAnchorEl({});
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    router.push(notification.link);
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "750px",
        minWidth: "600px",
        p: 2,
        mt: 2,
        borderRadius: 3,
        boxShadow: 3,
        transition: "width 0.2s ease-in-out",
      }}
    >
      {/* 🔹 Header with Title & Badge */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600} display="flex" alignItems="center">
          <Notifications sx={{ mr: 1, color: "gray" }} />
          Notifications
        </Typography>
        {unseenCount > 0 && <Badge badgeContent={unseenCount} color="error" />}
      </Box>

      {/* 🔹 Filter Buttons */}
      <ButtonGroup sx={{ mb: 2 }}>
        {["all", "myposts", "mentions", "connections"].map((type) => (
          <Button
            key={type}
            variant={filterType === type ? "contained" : "outlined"}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "bold",
              backgroundColor: filterType === type ? "green" : "white",
              color: filterType === type ? "white" : "black",
              "&:hover": { backgroundColor: filterType === type ? "darkgreen" : "grey.200" },
            }}
            onClick={() => setFilterType(type)}
          >
            {type === "all" ? "All" : type === "myposts" ? "My posts" : type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </ButtonGroup>

      {/* 🔹 Notifications List */}
      <Box
        ref={containerRef}
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          width: "100%",
          minWidth: "600px",
          maxWidth: "750px",
        }}
      >
        <List>
          {filteredNotifications.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center">
              No notifications found
            </Typography>
          ) : (
            filteredNotifications.map((notification) => (
              <Box key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    cursor: "pointer",
                    bgcolor: notification.markedasread ? "grey.200" : "inherit",
                    "&:hover": { bgcolor: "grey.100" },
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemAvatar>
                    <Avatar src={notification.profilePhoto} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.message}
                    secondary={notification.timestamp}
                    primaryTypographyProps={{ fontWeight: notification.markedasread ? "normal" : "bold" }}
                  />
                  <IconButton onClick={(event) => handleMenuOpen(event, notification.id)}>
                    <MoreVert />
                  </IconButton>
                </ListItem>
                <Divider />

                <Menu
                  anchorEl={anchorEl[notification.id]}
                  open={Boolean(anchorEl[notification.id])}
                  onClose={handleMenuClose}
                >
     <MenuItem
  onClick={() => {
    if (notification.markedasread) {
      useNotificationStore.getState().markAsUnread(notification.id); // ✅ Call markAsUnread
    } else {
      useNotificationStore.getState().markAsRead(notification.id);
    }
    handleMenuClose();
  }}
>
  <VisibilityOff sx={{ mr: 1 }} />
  Mark as {notification.markedasread ? "Unread" : "Read"}
</MenuItem>


                  <MenuItem onClick={() => deleteNotification(notification.id)}>
                    <Delete sx={{ mr: 1, color: "red" }} />
                    Delete
                  </MenuItem>
                </Menu>
              </Box>
            ))
          )}
        </List>
      </Box>
    </Card>
  );
};

export default NotificationCard;
