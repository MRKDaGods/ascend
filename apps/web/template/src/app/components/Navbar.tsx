"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Avatar,
  Badge,
  Button,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Home,
  People,
  Work,
  Message,
  Notifications,
  Apps,
  Search,
  ExpandMore,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useThemeStore } from "../store/useThemeStore";

// ✅ Custom Styles for Search Bar
const SearchBar = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#eef3f8",
  padding: "5px 10px",
  borderRadius: "5px",
  marginLeft: 10,
  width: "250px",
}));

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore(); // ✅ Get theme from Zustand store
  const muiTheme = useTheme(); // ✅ Use MUI theme values dynamically

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: muiTheme.palette.background.default,
        color: muiTheme.palette.text.primary,
        boxShadow: "none",
        borderBottom: `1px solid ${muiTheme.palette.mode === "dark" ? "#444" : "#ddd"}`,
        transition: "background-color 0.05s ease-in-out",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section (Logo + Search Bar) */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src="/initial-logo.jpg" alt="Ascend" style={{ height: 35 }} />
          <SearchBar>
            <Search sx={{ color: muiTheme.palette.text.primary, marginRight: 1 }} />
            <InputBase placeholder="Search" sx={{ color: muiTheme.palette.text.primary, width: "100%" }} />
          </SearchBar>
        </Box>

        {/* Center Section (Navigation Icons) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Tooltip title="Home">
            <IconButton>
              <Home sx={{ color: muiTheme.palette.text.primary }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="My Network">
            <IconButton>
              <People sx={{ color: muiTheme.palette.text.secondary }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Jobs">
            <IconButton>
              <Work sx={{ color: muiTheme.palette.text.secondary }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Messaging">
            <IconButton>
              <Message sx={{ color: muiTheme.palette.text.secondary }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={22} color="error">
                <Notifications sx={{ color: muiTheme.palette.text.secondary }} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Right Section (Profile, Theme Toggle, Business, Premium) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* ✅ Theme Toggle Button */}
          <Tooltip title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton onClick={toggleTheme}>
              {theme === "dark" ? <LightMode sx={{ color: "#ffea00" }} /> : <DarkMode sx={{ color: "#555" }} />}
            </IconButton>
          </Tooltip>

          {/* ✅ Profile Avatar */}
          <Avatar
            src="/profile.jpg"
            sx={{
              border: `2px solid ${theme === "dark" ? "#fff" : "#000"}`,
            }}
          />

          {/* ✅ Business Menu */}
          <Button sx={{ color: muiTheme.palette.text.primary, textTransform: "none" }} endIcon={<ExpandMore />}>
            For Business
          </Button>

          {/* ✅ Premium Button */}
          <Button variant="text" sx={{ color: theme === "dark" ? "#ffcc80" : "#915907", textTransform: "none" }}>
            Try Premium for EGP0
          </Button>

          {/* ✅ Apps Grid Icon */}
          <IconButton>
            <Apps sx={{ color: muiTheme.palette.text.secondary }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
