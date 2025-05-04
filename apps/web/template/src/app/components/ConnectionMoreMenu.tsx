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
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import FlagIcon from "@mui/icons-material/Flag";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import CloseIcon from "@mui/icons-material/Close";
import { useConnectionStore } from "../stores/useConnectionStore";
import { useEffect, useState } from "react";

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
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockSnackbarOpen, setBlockSnackbarOpen] = useState(false);

  const connectionStatuses = useConnectionStore((s) => s.connectionStatuses);
  const fetchConnectionStatus = useConnectionStore((s) => s.fetchConnectionStatus);
  const followStatuses = useConnectionStore((s) => s.followStatuses);
  const fetchFollowStatus = useConnectionStore((s) => s.fetchFollowStatus);
  const followUser = useConnectionStore((s) => s.followUser);
  const unfollowUser = useConnectionStore((s) => s.unfollowUser);
  const blockUser = useConnectionStore((s) => s.blockUser);

  const isCurrentlyFollowing = followStatuses[userId] ?? isFollowing;

  useEffect(() => {
    if (!(userId in followStatuses)) fetchFollowStatus(userId);
    if (!(userId in connectionStatuses)) fetchConnectionStatus(userId);
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      isCurrentlyFollowing ? await unfollowUser(userId) : await followUser(userId);
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

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreHorizIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem
          onClick={async () => {
            await handleFollowToggle();
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {isCurrentlyFollowing ? <PersonOffIcon fontSize="small" /> : <PersonAddAlt1Icon fontSize="small" />}
          </ListItemIcon>
          <ListItemText primary={isCurrentlyFollowing ? "Unfollow" : "Follow"} />
        </MenuItem>

        {connectionStatus === "connected" && (
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
        )}

        <MenuItem
          onClick={() => {
            setReportDialogOpen(true);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <FlagIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Report / Block" />
        </MenuItem>
      </Menu>

      {/* Report or Block Dialog */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="span">Report or block</Typography>
          <IconButton onClick={() => setReportDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            Select an action
          </Typography>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                setReportDialogOpen(false);
                setBlockDialogOpen(true);
              }}>
                <ListItemText primary={`Block ${firstName} ${lastName}`} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={`Report ${firstName} ${lastName} or entire account`} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Report profile element" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            If you found a problem with a post, comment, or message, use the reporting option located in those experiences.
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Block Confirmation Dialog */}
      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="span">Block</Typography>
          <IconButton onClick={() => setBlockDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography fontWeight={600} gutterBottom>
            You’re about to block {firstName} {lastName}
          </Typography>
          <Typography variant="body2">
            You’ll no longer be connected, and will lose any endorsements or recommendations from this person.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
          <Button onClick={() => {
            setBlockDialogOpen(false);
            setReportDialogOpen(true);
          }} variant="outlined">
            Back
          </Button>
          <Button onClick={handleBlockUser} variant="contained" color="primary">
            Block
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
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
