"use client";

import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import FlagIcon from "@mui/icons-material/Flag";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { useConnectionStore } from "../stores/useConnectionStore";
import { useEffect, useState } from "react";

interface ConnectionMoreMenuProps {
  userId: number;
  isFollowing: boolean;
  connectionStatus: "connected" | "pending" | "notConnected";
  onRemoveConnection: () => void;
}

const ConnectionMoreMenu: React.FC<ConnectionMoreMenuProps> = ({
  userId,
  isFollowing,
  connectionStatus,
  onRemoveConnection,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const connectionStatuses = useConnectionStore(
    (state) => state.connectionStatuses
  );
  const fetchConnectionStatus = useConnectionStore(
    (state) => state.fetchConnectionStatus
  );

  const followStatuses = useConnectionStore((state) => state.followStatuses);
  const fetchFollowStatus = useConnectionStore(
    (state) => state.fetchFollowStatus
  );
  const followUser = useConnectionStore((state) => state.followUser);
  const unfollowUser = useConnectionStore((state) => state.unfollowUser);

  const isCurrentlyFollowing = followStatuses[userId] ?? isFollowing;

  useEffect(() => {
    if (!(userId in followStatuses)) {
      fetchFollowStatus(userId);
    }
    if (!(userId in connectionStatuses)) {
      fetchConnectionStatus(userId);
    }
  }, [userId, followStatuses, connectionStatuses]);

  const handleFollowToggle = async () => {
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      // Refresh follow status after change
      await fetchFollowStatus(userId);
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
        {/* Follow / Unfollow */}
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

        {/* Remove Connection - Only if connected */}
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

        {/* Report / Block */}
        <MenuItem
          onClick={() => {
            alert("Report/Block logic pending.");
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <FlagIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Report / Block" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ConnectionMoreMenu;
