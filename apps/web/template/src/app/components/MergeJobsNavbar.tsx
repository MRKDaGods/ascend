"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  Button,
  Paper,
  InputBase,
  Badge,
  useMediaQuery,
  Divider,
  Tooltip,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Home,
  Work,
  Chat,
  Notifications,
  Search,
  DarkMode,
  LightMode,
  Logout,
  Settings,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { useSearchStore } from "../stores/useSearchStore";
import { useThemeStore } from "../stores/useThemeStore";
import { useProfileStore } from "../stores/useProfileStore";
import { useNotificationStore } from "../stores/useNotificationStore";

const MergeJobsNavbar: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { theme: appTheme, toggleTheme } = useThemeStore();
  const { notifications } = useNotificationStore();
  const unseenCount = notifications.filter((n) => !n.is_read).length;

  const { recentSearches, addSearch, setRecentSearches } = useSearchStore();
  const [searchParams, setSearchParams] = useState({ title: "", location: "" });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const userData = useProfileStore((state) => state.userData);
  const profilePicture = userData?.profile_picture_url || "/default-avatar.png";
  const fullName = userData
    ? `${userData.first_name} ${userData.last_name}`
    : "User";

  useEffect(() => {
    const stored = localStorage.getItem("recentJobSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, [setRecentSearches]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("User logged out");
    handleMenuClose();
  };

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: "sticky",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: isSmallScreen ? "center" : "initial",
        }}
      >
        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push("/feed")}
          >
            Ascend
          </Typography>
        </Box>

        {/* CENTER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 2,
            gap: 1,
            marginY: 1,
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
          {/* Search Inputs */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Paper
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                width: isSmallScreen ? "130px" : "300px",
                padding: "4px 10px",
                borderRadius: "30px",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
              <InputBase
                name="title"
                placeholder="Job title"
                value={searchParams.title}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                sx={{ fontSize: "0.85rem", width: "100%" }}
              />
            </Paper>
            <Paper
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                width: isSmallScreen ? "130px" : "300px",
                padding: "4px 10px",
                borderRadius: "30px",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
              <InputBase
                name="location"
                placeholder="Location"
                value={searchParams.location}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                sx={{ fontSize: "0.85rem", width: "100%" }}
              />
            </Paper>
          </Box>
          <Button
            variant="contained"
            onClick={() =>
              router.push(
                `/search?title=${searchParams.title}&location=${searchParams.location}`
              )
            }
            sx={{ borderRadius: "20px" }}
          >
            Search
          </Button>
        </Box>

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip
            title={
              appTheme === "dark"
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
            }
          >
            <IconButton onClick={toggleTheme}>
              {appTheme === "dark" ? (
                <LightMode sx={{ color: "#ffeb3b" }} />
              ) : (
                <DarkMode sx={{ color: "#333" }} />
              )}
            </IconButton>
          </Tooltip>

          <IconButton
            onClick={() => router.push("/feed")}
            sx={{
              backgroundColor:
                pathname === "/feed"
                  ? theme.palette.action.hover
                  : "transparent",
              borderRadius: "50%",
            }}
          >
            <Home />
          </IconButton>

          <IconButton
            onClick={() => router.push("/jobs")}
            sx={{
              backgroundColor:
                pathname === "/jobs"
                  ? theme.palette.action.hover
                  : "transparent",
              borderRadius: "50%",
            }}
          >
            <Work />
          </IconButton>

          <IconButton
            onClick={() => router.push("/notifications")}
            sx={{
              backgroundColor:
                pathname === "/notifications"
                  ? theme.palette.action.hover
                  : "transparent",
              borderRadius: "50%",
            }}
          >
            <Badge badgeContent={unseenCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Avatar with Menu */}
          <Avatar
            sx={{ width: 30, height: 30, cursor: "pointer" }}
            src={profilePicture}
            alt={fullName}
            onClick={handleMenuOpen}
          />
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 6,
              sx: {
                mt: 1.5,
                borderRadius: 3,
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box px={2} py={2} textAlign="center">
              <Avatar
                src={profilePicture}
                sx={{ width: 58, height: 58, mx: "auto" }}
              />
              <Typography fontWeight={600} mt={1}>
                {fullName}
              </Typography>
              <Button
                onClick={() => {
                  handleMenuClose();
                  router.push("/profile");
                }}
                variant="outlined"
                fullWidth
                sx={{ mt: 1.5, borderRadius: "999px", textTransform: "none" }}
              >
                View Profile
              </Button>
            </Box>

            <Divider />
            <MenuItem onClick={() => router.push("/settings")}>
              <Settings fontSize="small" sx={{ mr: 1 }} />
              Settings & Privacy
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MergeJobsNavbar;