"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Home, People, Work, Chat, Notifications } from "@mui/icons-material";
import { useProfileStore } from "../store/useProfileStore";
import { api } from "../../api";

const Navbar: React.FC = () => {
  const { userData } = useProfileStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isClient, setIsClient] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setIsClient(true); // Prevents SSR mismatch
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      window.location.reload(); // Reload page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
    setAnchorEl(null);
  };

  if (!isClient) return null; // Prevents SSR-related hydration issues

  // Get current company/role from experiences if available
  const currentExperience = userData?.experience?.sort((a, b) => {
    const dateA = a.end_date ? new Date(a.end_date) : new Date();
    const dateB = b.end_date ? new Date(b.end_date) : new Date();
    return dateB.getTime() - dateA.getTime();
  })[0];

  const fullName = userData ? `${userData.first_name} ${userData.last_name}` : "";
  const currentRole = currentExperience?.position || "";
  const currentCompany = currentExperience?.company || "";

  return (
    <AppBar position="fixed" color="default" sx={{ boxShadow: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Logo */}
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          LinkedIn
        </Typography>

        {/* Center: Navigation Icons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton><Home /></IconButton>
          <IconButton><People /></IconButton>
          <IconButton><Work /></IconButton>
          <IconButton><Chat /></IconButton>
          <IconButton><Notifications /></IconButton>
        </Box>

        {/* Right: Profile Menu */}
        {userData ? (
          <>
            <IconButton onClick={handleMenuOpen}>
              <Avatar src={userData.profile_picture_url || "/default-avatar.jpg"} alt={fullName} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem disabled>
                <Typography variant="body1" fontWeight="bold">
                  {fullName}
                </Typography>
              </MenuItem>
              {currentRole && currentCompany && (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {currentRole} at {currentCompany}
                  </Typography>
                </MenuItem>
              )}
              <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings & Privacy</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <CircularProgress size={24} />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;