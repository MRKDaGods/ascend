"use client";

import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import FlagIcon from "@mui/icons-material/Flag";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { useConnectionStore } from "../stores/useConnectionStore";

interface ConnectionMoreMenuProps {
  userId: number;
  isFollowing: boolean;
  connectionStatus: "connected" | "pending" | "notConnected";
  onRemoveConnection: () => void;
  firstName: string;
  lastName: string;
}

const ConnectionMoreMenu: React.FC<ConnectionMoreMenuProps> = ({
  userId,
  isFollowing,
  connectionStatus,
  onRemoveConnection,
  firstName,
  lastName,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockSnackbarOpen, setBlockSnackbarOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  const connectionStatuses = useConnectionStore((s) => s.connectionStatuses);
  const fetchConnectionStatus = useConnectionStore(
    (s) => s.fetchConnectionStatus
  );
  const followStatuses = useConnectionStore((s) => s.followStatuses);
  const fetchFollowStatus = useConnectionStore((s) => s.fetchFollowStatus);
  const followUser = useConnectionStore((s) => s.followUser);
  const unfollowUser = useConnectionStore((s) => s.unfollowUser);
  const blockUser = useConnectionStore((s) => s.blockUser);
  const sendMessageRequest = useConnectionStore((s) => s.sendMessageRequest);

  const isCurrentlyFollowing = followStatuses[userId] ?? isFollowing;

  useEffect(() => {
    if (!(userId in followStatuses)) fetchFollowStatus(userId);
    if (!(userId in connectionStatuses)) fetchConnectionStatus(userId);
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      isCurrentlyFollowing
        ? await unfollowUser(userId)
        : await followUser(userId);
      fetchFollowStatus(userId);
    } catch (error) {
      console.error("❌ Follow toggle failed", error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBlockUser = async () => {
    try {
      await blockUser(userId);
      setBlockSnackbarOpen(true);
    } catch {
      console.error("❌ Failed to block user");
    } finally {
      setBlockDialogOpen(false);
    }
  };

  const handleSendMessage = async () => {
    try {
      await sendMessageRequest({ userId, message });
      setMessage("");
      setMessageDialogOpen(false);
    } catch (err) {
      console.error("❌ Failed to send message request", err);
    }
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreHorizIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={async () => {
            await handleFollowToggle();
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {isCurrentlyFollowing ? (
              <PersonOffIcon fontSize="small" />
            ) : (
              <PersonAddAlt1Icon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={isCurrentlyFollowing ? "Unfollow" : "Follow"}
          />
        </MenuItem>

        {connectionStatus === "connected" ? (
          <MenuItem
            onClick={() => {
              onRemoveConnection();
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <PersonRemoveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Remove Connection" />
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setMessageDialogOpen(true);
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <PersonAddAlt1Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Message (without connecting)" />
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            setBlockDialogOpen(true);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <FlagIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Report / Block" />
        </MenuItem>
      </Menu>

      {/* Message Dialog */}
      <Dialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Send Message Request</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi, I'd like to chat about..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={!message.trim()}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block Confirmation Dialog */}
      <Dialog
        open={blockDialogOpen}
        onClose={() => setBlockDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="span">
            Block
          </Typography>
          <IconButton onClick={() => setBlockDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography fontWeight={600} gutterBottom>
            You’re about to block {firstName} {lastName}
          </Typography>
          <Typography variant="body2">
            You’ll no longer be connected or able to exchange messages.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setBlockDialogOpen(false);
            }}
            variant="outlined"
          >
            Back
          </Button>
          <Button onClick={handleBlockUser} variant="contained" color="primary">
            Block
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={blockSnackbarOpen}
        onClose={() => setBlockSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={4000}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setBlockSnackbarOpen(false)}
          sx={{ width: "100%" }}
        >
          {`${firstName} ${lastName} has been blocked.`}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConnectionMoreMenu;
