'use client';

import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem, Typography, Box, CircularProgress } from "@mui/material";
import { Home, People, Work, Chat, Notifications } from "@mui/icons-material";

interface UserData {
  name: string;
  profilePhoto: string;
  coverPhoto: string;
  role: string;
  entity: string;
  location: string;
}

const Navbar: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setIsClient(true); // Ensure it's running on the client

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data: UserData = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!isClient) return null; // Prevents SSR rendering mismatch

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

        {/* Right: Profile */}
        {userData ? (
          <>
            <IconButton onClick={handleMenuOpen}>
              <Avatar src={userData.profilePhoto} alt={userData.name} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem disabled>
                <Typography variant="body1" fontWeight="bold">{userData.name}</Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="body2" color="textSecondary">{userData.role} at {userData.entity}</Typography>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings & Privacy</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
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
