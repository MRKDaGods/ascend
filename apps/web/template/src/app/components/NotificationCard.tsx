"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
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
  Divider,
  Button,
  ButtonGroup,
  useTheme,
} from "@mui/material";
import {
  MoreVert,
  Notifications,
  Delete,
  VisibilityOff,
} from "@mui/icons-material";

import { useNotificationStore } from "../stores/useNotificationStore";
import { Notification, NotificationType, Profile } from "@ascend/api-client/models";

// Type override for notification payload
interface NotificationPayload {
  link?: string;
  profile?: Profile;
  profile_picture_url?: string;
  user_id?: number;
  first_name?: string;
  last_name?: string;
}

const NotificationCard: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [filterType, setFilterType] = useState("all");

  const {
    notifications,
    hydrated,
    markAsRead,
    markAsUnread,
    deleteNotification,
    setNotifications,
  } = useNotificationStore();

  useEffect(() => {
    if (!hydrated) return;

    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, [hydrated, setNotifications]);

  if (!hydrated) return null;

  const unseenCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = notifications.filter((n) => {
    switch (filterType) {
      case "myposts":
        return [NotificationType.LIKE, NotificationType.COMMENT, NotificationType.WELCOME].includes(n.type);
      case "mentions":
        return n.type === NotificationType.MENTION;
      case "connections":
        return [NotificationType.CONNECTION, NotificationType.FOLLOW].includes(n.type);
      default:
        return true;
    }
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    event.stopPropagation();
    setAnchorEl({ [id.toString()]: event.currentTarget });
  };

  const handleMenuClose = () => setAnchorEl({});

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    const link = (notification.payload as NotificationPayload)?.link;
    if (link) router.push(`/notif${link}`);
  };

  const getProfilePicture = (n: Notification) => {
    const p = n.payload as NotificationPayload;
    return p?.profile?.profile_picture_url || p?.profile_picture_url || "/default-avatar.jpg";
  };

  const getSenderName = (n: Notification) => {
    const p = n.payload as NotificationPayload;
    return p?.profile?.first_name
      ? `${p.profile.first_name} ${p.profile.last_name || ""}`
      : p?.first_name
      ? `${p.first_name} ${p.last_name || ""}`
      : null;
  };

  const renderNotificationText = (n: Notification) => {
    const sender = getSenderName(n);
    return (
      <Box component="span">
        {sender && (
          <Typography
            component="span"
            fontWeight="bold"
            sx={{ display: "inline", mr: 0.5 }}
          >
            {sender}
          </Typography>
        )}
        <Typography component="span" sx={{ display: "inline" }}>
          {n.message}
        </Typography>
      </Box>
    );
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 750,
        p: 2,
        mt: 2,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600} display="flex" alignItems="center">
          <Notifications sx={{ mr: 1, color: theme.palette.text.secondary }} />
          Notifications
        </Typography>
        {unseenCount > 0 && (
          <Badge badgeContent={unseenCount} color="error" />
        )}
      </Box>

      {/* Filter Buttons */}
      <ButtonGroup fullWidth sx={{ mb: 2 }}>
        {["all", "myposts", "mentions", "connections"].map((type) => (
          <Button
            key={type}
            variant={filterType === type ? "contained" : "outlined"}
            onClick={() => setFilterType(type)}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 600,
              backgroundColor:
                filterType === type ? theme.palette.primary.main : theme.palette.background.paper,
              color:
                filterType === type
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.primary,
              "&:hover": {
                backgroundColor:
                  filterType === type
                    ? theme.palette.primary.dark
                    : theme.palette.action.hover,
              },
            }}
          >
            {type === "all"
              ? "All"
              : type === "myposts"
              ? "My posts"
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </ButtonGroup>

      {/* Notification List */}
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          overflow: "visible",
          wordBreak: "break-word",
          p: 1,
        }}
      >
        <List>
          {filteredNotifications.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center">
              No notifications found
            </Typography>
          ) : (
            filteredNotifications.map((n) => (
              <Box key={n.id}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => handleNotificationClick(n)}
                  sx={{
                    cursor: "pointer",
                    bgcolor: n.is_read
                      ? theme.palette.mode === "dark"
                        ? theme.palette.background.default
                        : theme.palette.grey[100]
                      : theme.palette.action.selected,
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
                    borderRadius: 2,
                    mb: 1,
                    position: "relative",
                    pl: 2,
                    transition: "background-color 0.3s",
                  }}
                >
                  {!n.is_read && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: theme.palette.primary.main,
                      }}
                    />
                  )}
                  <ListItemAvatar>
                    <Avatar src={getProfilePicture(n)} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={renderNotificationText(n)}
                    secondary={
                      n.created_at
                        ? new Date(n.created_at).toLocaleString()
                        : ""
                    }
                    primaryTypographyProps={{
                      component: "div",
                      fontWeight: n.is_read ? "normal" : "medium",
                    }}
                  />
                  <IconButton onClick={(e) => handleMenuOpen(e, n.id)}>
                    <MoreVert />
                  </IconButton>
                </ListItem>
                <Divider component="li" />

                <Menu
                  anchorEl={anchorEl[n.id.toString()]}
                  open={Boolean(anchorEl[n.id.toString()])}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      n.is_read ? markAsUnread(n.id) : markAsRead(n.id);
                      handleMenuClose();
                    }}
                  >
                    <VisibilityOff sx={{ mr: 1 }} />
                    Mark as {n.is_read ? "Unread" : "Read"}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      deleteNotification(n.id);
                      handleMenuClose();
                    }}
                  >
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
