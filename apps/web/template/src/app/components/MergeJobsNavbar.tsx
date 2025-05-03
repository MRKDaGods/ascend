"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
  Button,
  Badge,
  useMediaQuery,
  Tooltip,
  Typography,
  Divider,
  MenuItem,
  Drawer,
  Menu,
  ListItemText,
  ListItemIcon,
  Popover,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Home,
  Work,
  People,
  Message,
  Notifications,
  DarkMode,
  LightMode,
  ExpandMore,
  Menu as MenuIcon,
  Close,
  Search as SearchIcon,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

import { useRouter, usePathname } from "next/navigation";
import { useThemeStore } from "../stores/useThemeStore";
import { useProfileStore } from "../stores/useProfileStore";
import { useNotificationStore } from "../stores/useNotificationStore";
import { useMenuStore } from "../stores/useMenuStore";
import SearchBar from "./SearchBar";
import { api, refreshAuthState } from "@/api";
import BusinessMenu from "./BusinessMenu";

// 🎯 Active nav highlight
const NavIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(({ theme, active }) => ({
  padding: 10,
  borderRadius: "12px",
  backgroundColor: active
    ? theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "#f0f0f0"
    : "transparent",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#eaeaea",
  },
}));

const MergeJobsNavbar: React.FC = () => {
  const theme = useTheme();
  const muiTheme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { theme: appTheme, toggleTheme } = useThemeStore();
  const { notifications } = useNotificationStore();
  const unseenCount = notifications.filter((n) => !n.is_read).length;
  const { setAnchorEl, anchorEl } = useMenuStore();

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);

  const userData = useProfileStore((state) => state.userData);
  const profilePicture = userData?.profile_picture_url || "/default-avatar.png";
  const fullName = userData
    ? `${userData.first_name} ${userData.last_name}`
    : "User";

  const navigationItems = [
    { icon: <Home />, route: "/feed", label: "Home" },
    { icon: <People />, route: "/network", label: "My Network" },
    { icon: <Work />, route: "/jobs", label: "Jobs" },
    { icon: <Message />, route: "/chat", label: "Messaging" },
    {
      icon: <Notifications />,
      route: "/notif",
      label: "Notifications",
      badge: unseenCount,
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const [businessAnchorEl, setBusinessAnchorEl] = useState<null | HTMLElement>(null);
  const businessMenuOpen = Boolean(businessAnchorEl);

  const handleBusinessClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBusinessAnchorEl(event.currentTarget);
  };

  const handleBusinessClose = () => {
    setBusinessAnchorEl(null);
  };

  const handleLogout = () => {
    api.auth
      .logout()
      .then(() => {
        console.log("Logout successful");
        refreshAuthState();
        router.push("/authen");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const renderUserProfileArea = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Tooltip title="Me">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar
            src={profilePicture}
            alt={fullName}
            sx={{
              transition: "0.3s",
              "&:hover": { transform: "scale(1.1)" },
            }}
          />
        </IconButton>
      </Tooltip>

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 6,
          sx: {
            mt: 1.5,
            borderRadius: 3,
            background: muiTheme.palette.background.paper,
            color: muiTheme.palette.text.primary,
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
              setAnchorEl(null);
              router.push("/profile");
            }}
            variant="outlined"
            fullWidth
            sx={{ mt: 1.5, borderRadius: "999px", textTransform: "none" }}
          >
            View Profile
          </Button>
        </Box>

        <Typography px={2} mt={1} fontSize="0.75rem" fontWeight={700} color="gray">
          Account
        </Typography>
        <MenuItem>
          <ListItemText>Try Premium</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText onClick={() => router.push("/Settings")}>
            Settings & Privacy
          </ListItemText>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>

        <Divider />
        <Typography px={2} mt={1} fontSize="0.75rem" fontWeight={700} color="gray">
          Manage
        </Typography>
        <MenuItem>
          <ListItemText>Posts & Activity</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Job Posting Account</ListItemText>
        </MenuItem>

        <Divider />
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText onClick={handleLogout}>Sign Out</ListItemText>
        </MenuItem>
      </Menu>

      {/* Theme Toggle */}
      <Tooltip
        title={appTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <IconButton onClick={toggleTheme}>
          {appTheme === "dark" ? (
            <LightMode sx={{ color: "#ffeb3b" }} />
          ) : (
            <DarkMode sx={{ color: "#333" }} />
          )}
        </IconButton>
      </Tooltip>

      {/* Business Button and Menu */}
      <Button
        sx={{
          color: muiTheme.palette.text.primary,
          textTransform: "none",
          fontWeight: 500,
        }}
        endIcon={<ExpandMore />}
        onClick={handleBusinessClick}
      >
        For Business
      </Button>

      {/* Business Popover */}
      <Popover
        open={businessMenuOpen}
        anchorEl={businessAnchorEl}
        onClose={handleBusinessClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ 
          sx: { 
            width: { xs: "95%", sm: "90%", md: 700 },
            mt: 1,
            maxHeight: "80vh",
            overflowY: "auto" 
          } 
        }}
      >
        <BusinessMenu />
      </Popover>

      {/* Premium Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#FFC107",
          color: "#000",
          textTransform: "none",
          borderRadius: "999px",
          fontWeight: 600,
          px: 2.5,
          whiteSpace: "nowrap", // Add this to prevent text wrapping
          "&:hover": {
            backgroundColor: "#D4AF37",
          },
        }}
      >
        Try Premium Free
      </Button>
    </Box>
  );

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: muiTheme.palette.background.paper,
        color: muiTheme.palette.text.primary,
        borderBottom: `1px solid ${muiTheme.palette.divider}`,
        position: "sticky",
        height: { xs: "auto", md: 80 },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 1,
          minHeight: 64,
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 1, md: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="/logoIcon.png"
              alt="Ascend"
              style={{ height: 36, borderRadius: 6, cursor: "pointer" }}
              onClick={() => router.push("/feed")}
            />
          </Box>

          {/* Desktop Navigation and Search */}
          {!isSmallScreen && (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              gap: 3,
              width: "100%",
              mx: "auto"
            }}>
              {/* Left Group: SearchBar Component with Navigation Icons */}
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "flex-end",
                gap: 2,
                flex: 1
              }}>
                {/* SearchBar Component */}
                <SearchBar isSmallScreen={isSmallScreen} />

                {/* Navigation Icons */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {navigationItems.map(({ icon, route, label, badge }, i) => (
                    <Tooltip key={i} title={label}>
                      <NavIconButton
                        onClick={() => handleNavigation(route)}
                        active={pathname === route}
                      >
                        {badge && badge > 0 ? (
                          <Badge badgeContent={badge} color="error">
                            {React.cloneElement(icon, {
                              sx: { color: muiTheme.palette.text.secondary },
                            })}
                          </Badge>
                        ) : (
                          React.cloneElement(icon, {
                            sx: { color: muiTheme.palette.text.secondary },
                          })
                        )}
                      </NavIconButton>
                    </Tooltip>
                  ))}
                </Box>
              </Box>

              {/* Right Group: User Profile Area */}
              <Box sx={{ flex: 1 }}>
                {renderUserProfileArea()}
              </Box>
            </Box>
          )}

          {/* Mobile Controls */}
          {isSmallScreen && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Search Icon for Mobile */}
              <IconButton
                color="inherit"
                onClick={() => setSearchDrawerOpen(true)}
              >
                <SearchIcon />
              </IconButton>

              {/* Theme Toggle */}
              <IconButton onClick={toggleTheme}>
                {appTheme === "dark" ? (
                  <LightMode sx={{ color: "#ffeb3b" }} />
                ) : (
                  <DarkMode sx={{ color: "#333" }} />
                )}
              </IconButton>
              
              {/* Avatar for Mobile */}
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar
                  src={profilePicture}
                  alt={fullName}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>

              {/* Menu Button for Mobile */}
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Mobile Search Bar - For when screen is small but not too small */}
        {isSmallScreen && !isMobileScreen && (
          <Box sx={{ width: "100%", py: 1 }}>
            <SearchBar isSmallScreen={true} />
          </Box>
        )}
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2, px: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {navigationItems.map(({ icon, route, label, badge }, i) => (
            <MenuItem 
              key={i} 
              onClick={() => handleNavigation(route)}
              selected={pathname === route}
              sx={{ 
                borderRadius: 1,
                mb: 1,
                py: 1.5
              }}
            >
              {badge && badge > 0 ? (
                <Badge badgeContent={badge} color="error" sx={{ mr: 2 }}>
                  {icon}
                </Badge>
              ) : (
                <Box sx={{ mr: 2 }}>{icon}</Box>
              )}
              {label}
            </MenuItem>
          ))}
          
          <Divider sx={{ my: 2 }} />
          
          <MenuItem>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#FFC107",
                color: "#000",
                textTransform: "none",
                borderRadius: "999px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: "#D4AF37",
                },
              }}
            >
              Try Premium Free
            </Button>
          </MenuItem>
          
          <MenuItem>
            <Button
              fullWidth
              sx={{
                color: muiTheme.palette.text.primary,
                textTransform: "none",
                fontWeight: 500,
              }}
              endIcon={<ExpandMore />}
              onClick={(e) => {
                setMobileMenuOpen(false);
                setBusinessAnchorEl(e.currentTarget);
              }}
            >
              For Business
            </Button>
          </MenuItem>
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
          </MenuItem>
        </Box>
      </Drawer>

      {/* Mobile Search Drawer - For Very Small Screens */}
      <Drawer
        anchor="top"
        open={searchDrawerOpen && isMobileScreen}
        onClose={() => setSearchDrawerOpen(false)}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <IconButton onClick={() => setSearchDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <SearchBar isSmallScreen={true} />
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default MergeJobsNavbar;