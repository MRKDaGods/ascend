import React, { useRef, useState, useEffect } from "react";
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
import { useNotificationStore } from "../stores/useNotificationStore";
import { Notification, NotificationType } from "@ascend/api-client/models";
import { Profile } from "@ascend/api-client/models";

// Type for notification payload that might contain profile information
interface NotificationPayload {
  link?: string;
  profile?: Profile;
  profile_picture_url?: string;
  user_id?: number;
  first_name?: string;
  last_name?: string;
}

const NotificationCard: React.FC = () => {
  const { notifications, markAsRead, markAsUnread, deleteNotification, hydrated } =
    useNotificationStore();
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: null | HTMLElement }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (!hydrated) return;

    // Ensure notifications are loaded correctly from localStorage
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      useNotificationStore.getState().setNotifications(JSON.parse(storedNotifications));
    }
  }, [hydrated]);

  if (!hydrated) return null; // Prevent rendering before hydration

  const unseenCount = notifications.filter((notif) => !notif.is_read).length;

  // Filtering Notifications Based on Type
  const filteredNotifications = notifications.filter((notification) => {
    switch (filterType) {
      case "myposts":
        return [NotificationType.LIKE, NotificationType.COMMENT, NotificationType.WELCOME].includes(notification.type);
      case "mentions":
        return notification.type === NotificationType.MENTION;
      case "connections":
        return notification.type === NotificationType.CONNECTION ||
          notification.type === NotificationType.FOLLOW;
      default:
        return true; // "all" filter
    }
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl({ [id.toString()]: event.currentTarget });
  };

  const handleMenuClose = () => {
    setAnchorEl({});
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // TODO:  Assuming link is stored in the payload
    if (notification.payload?.link) {
      router.push(`/notif${notification.payload.link}`);
        }
  };

  // Helper function to get profile picture
  const getProfilePicture = (notification: Notification) => {
    const payload = notification.payload as NotificationPayload;
    // Check if profile is in payload
    if (payload?.profile?.profile_picture_url) {
      return payload.profile.profile_picture_url;
    }

    // Fallback to direct profile_picture_url in payload
    if (payload?.profile_picture_url) {
      return payload.profile_picture_url;
    }
    return "/default-avatar.png";
  };

  // Helper function to get sender name
  const getSenderName = (notification: Notification) => {
    const payload = notification.payload as NotificationPayload;

    // Check if profile with name info is in payload
    if (payload?.profile?.first_name) {
      return `${payload.profile.first_name} ${payload.profile.last_name || ''}`;
    }

    // Check if name is directly in payload
    if (payload?.first_name) {
      return `${payload.first_name} ${payload.last_name || ''}`;
    }

    return null;
  };

  const formatNotification = (notification: Notification) => {
    const senderName = getSenderName(notification);

    if (senderName) {
      return (
        <Box component="span">
          <Typography
            component="span"
            sx={{
              fontWeight: 'bold',
              display: 'inline',
              mr: 0.5
            }}
          >
            {senderName}
          </Typography>
          <Typography component="span" sx={{ display: 'inline' }}>
            {notification.message}
          </Typography>
        </Box>
      );
    }

    // Return just the message if no sender info available
    return notification.message;
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "750px",
        p: 2,
        mt: 2,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      {/* Header with Title & Badge */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600} display="flex" alignItems="center">
          <Notifications sx={{ mr: 1, color: "gray" }} />
          Notifications
        </Typography>
        {unseenCount > 0 && <Badge badgeContent={unseenCount} color="error" data-testid="unseen-count-badge"/>}
      </Box>

      {/*  Filter Buttons */}
      <ButtonGroup sx={{ mb: 2 }}>
        {["all", "myposts", "mentions", "connections"].map((type) => (
          <Button
            key={type}
            data-testid={`filter-button-${type}`}
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

      {/*  Notifications List */}
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          overflow: "visible",
          whiteSpace: "normal",
          wordBreak: "break-word",
          minHeight: "100%",
          p: 2,
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
                    bgcolor: notification.is_read ? "grey.100" : "inherit",
                    "&:hover": { bgcolor: "grey.200" },
                    borderRadius: 1,
                    mb: 0.5,
                    position: 'relative',
                    pl: notification.is_read ? 2 : 2,
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.is_read && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        ml: 0.5
                      }}
                    />
                  )}
                  <ListItemAvatar>
                    <Avatar src={getProfilePicture(notification)} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={formatNotification(notification)}
                    secondary={notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
                    primaryTypographyProps={{
                      component: 'div',
                      fontWeight: notification.is_read ? "normal" : "medium"
                    }}
                  />
                  <IconButton
                    data-testid="more-options-button"
                    onClick={(event) => handleMenuOpen(event, notification.id)}
                  >
                    <MoreVert />
                  </IconButton>
                </ListItem>
                <Divider variant="inset" component="li" />

                <Menu
                  anchorEl={anchorEl[notification.id?.toString() || '']}
                  open={Boolean(anchorEl[notification.id?.toString() || ''])}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      if (notification.is_read) {
                        markAsUnread(notification.id);
                      } else {
                        markAsRead(notification.id);
                      }
                      handleMenuClose();
                    }}
                  >
                    <VisibilityOff sx={{ mr: 1 }} />
                    Mark as {notification.is_read ? "Unread" : "Read"}
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      deleteNotification(notification.id);
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