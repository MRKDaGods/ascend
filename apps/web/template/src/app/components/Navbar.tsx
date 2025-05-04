"use client";

import React, { useState, useEffect } from "react";
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
  Menu,
  MenuItem,
  Divider,
  ListItemText,
  ListItemIcon,
  Typography,
  Popover,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import {
  Home,
  People,
  Work,
  Message,
  Notifications,
  Search,
  ExpandMore,
  DarkMode,
  LightMode,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";
import { useThemeStore } from "../stores/useThemeStore";
import { useRouter, usePathname } from "next/navigation";
import { useMenuStore } from "../stores/useMenuStore";
import { useNotificationStore } from "../stores/useNotificationStore";
import { useProfileStore } from "../stores/useProfileStore";
import { usePostStore } from "../stores/usePostStore";

import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchResults from "./SearchResults";
import { api, refreshAuthState } from "@/api";
import BusinessMenu from "./BusinessMenu";

// 🔍 Glassy search bar
const SearchBar = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "30px",
  padding: "6px 14px",
  marginLeft: 20,
  width: "270px",
  [theme.breakpoints.down("md")]: {
    marginLeft: 10,
    width: "100%",
  },
  [theme.breakpoints.down("sm")]: {
    margin: 0,
    width: "100%",
  },
}));

// 🎯 Active nav highlight
const NavIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(({ theme, active }) => ({
  padding: 8, // Reduced padding for more compact layout
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

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const muiTheme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { userData, setUserData } = useProfileStore();

  const [searchQuery, setSearchQuery] = React.useState("");
  const { ultimateSearch } = usePostStore();
  const { anchorEl, setAnchorEl, closeMenu } = useMenuStore();
  const { notifications } = useNotificationStore();
  const unseenCount = notifications.filter((n) => !n.is_read).length;

  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down("md"));
  const isMobileScreen = useMediaQuery(muiTheme.breakpoints.down("sm"));

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);

  // Safely derive profile picture and full name
  const profilePicture = userData?.profile_picture_url || "/default-avatar.png";
  const fullName = userData
    ? `${userData.first_name} ${userData.last_name}`
    : "User";

  const [businessAnchorEl, setBusinessAnchorEl] = useState<null | HTMLElement>(
    null
  );
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
        console.log("auth tk:", localStorage.getItem("auth_token"));
        refreshAuthState();
        router.push("/authen");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        await ultimateSearch(searchQuery.trim());
        setSearchDrawerOpen(false); // Close drawer after search on mobile
      } catch (error) {
        console.error("❌ Search failed:", error);
      }
    }
  };

  useEffect(() => {
    if (!userData) {
      api.user.getLocalUserProfile().then(setUserData).catch(console.error);
    }
  }, []);

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

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: muiTheme.palette.background.paper,
        color: muiTheme.palette.text.primary,
        borderBottom: `1px solid ${muiTheme.palette.divider}`,
        position: "sticky",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 1,
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 1, md: 0 },
        }}
      >
        {/* TOP BAR - Logo, Search/Menu Icons */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* LEFT: Logo and Search */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: isSmallScreen ? 0 : 1,
            }}
          >
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src="/logoIcon.png"
                alt="Ascend"
                style={{ height: 36, borderRadius: 6 }}
              />
              <Box
                onClick={() => router.push("/feed")}
                sx={{ cursor: "pointer" }}
              >
                <Typography variant="h5" color="primary" fontWeight="bold">
                  Ascend
                </Typography>
              </Box>
            </Box>

            {/* Desktop Search with Navigation Icons */}
            {!isSmallScreen && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                <SearchBar>
                  <Search
                    sx={{ color: muiTheme.palette.text.secondary, mr: 1 }}
                  />
                  <InputBase
                    placeholder="Search for jobs, people..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        await handleSearch();
                      }
                    }}
                    sx={{
                      color: muiTheme.palette.text.primary,
                      fontSize: "0.85rem",
                      width: "100%",
                    }}
                  />
                </SearchBar>

                {/* Desktop Navigation Icons - Now next to search bar */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: 3,
                    gap: 3.5,
                  }}
                >
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
            )}
          </Box>

          {/* Mobile Search */}
          {isSmallScreen && !isMobileScreen && (
            <SearchBar>
              <Search sx={{ color: muiTheme.palette.text.secondary, mr: 1 }} />
              <InputBase
                placeholder="Search for jobs, people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    await handleSearch();
                  }
                }}
                sx={{
                  color: muiTheme.palette.text.primary,
                  fontSize: "0.85rem",
                  width: "100%",
                }}
              />
            </SearchBar>
          )}

          {/* Mobile Controls */}
          {isSmallScreen && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Search Icon for Mobile */}
              <IconButton
                color="inherit"
                onClick={() => setSearchDrawerOpen(true)}
              >
                <Search />
              </IconButton>

              {/* Theme Toggle */}
              <IconButton onClick={toggleTheme}>
                {theme === "dark" ? (
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

        {/* FULL WIDTH SEARCH - On mobile screens */}
        {isSmallScreen && isMobileScreen && (
          <Box sx={{ width: "100%", px: 2, pb: 1 }}>
            <SearchBar>
              <Search sx={{ color: muiTheme.palette.text.secondary, mr: 1 }} />
              <InputBase
                placeholder="Search for jobs, people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    await handleSearch();
                  }
                }}
                sx={{
                  color: muiTheme.palette.text.primary,
                  fontSize: "0.85rem",
                  width: "100%",
                }}
              />
            </SearchBar>
          </Box>
        )}

        {/* DESKTOP: User Controls */}
        {!isSmallScreen && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* User Avatar */}
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

            {/* Theme Toggle */}
            <Tooltip
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              <IconButton onClick={toggleTheme}>
                {theme === "dark" ? (
                  <LightMode sx={{ color: "#ffeb3b" }} />
                ) : (
                  <DarkMode sx={{ color: "#333" }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Business Button */}
            <Button
              sx={{
                color: muiTheme.palette.text.primary,
                textTransform: "none",
                borderRadius: "999px",
                fontWeight: 600,
                px: 2.5,
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: muiTheme.palette.action.hover,
                },
              }}
              endIcon={<ExpandMore />}
              onClick={handleBusinessClick}
            >
              For Business
            </Button>

            {/* Premium Button */}
            <Button
              onClick={() => router.push("/prem")}
              variant="contained"
              sx={{
                backgroundColor: "#FFC107",
                color: "#000",
                textTransform: "none",
                borderRadius: "999px",
                fontWeight: 600,
                px: 2.5,
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: "#D4AF37",
                },
              }}
            >
              Try Premium Free
            </Button>
          </Box>
        )}
      </Toolbar>

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
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
              closeMenu();
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
        <Typography
          px={2}
          mt={1}
          fontSize="0.75rem"
          fontWeight={700}
          color="gray"
        >
          Account
        </Typography>
        <MenuItem>
          <ListItemText>Try Premium</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            router.push("/Settings");
          }}
        >
          <ListItemText>Settings & Privacy</ListItemText>
        </MenuItem>

        <Divider />
        <Typography
          px={2}
          mt={1}
          fontSize="0.75rem"
          fontWeight={700}
          color="gray"
        >
          Manage
        </Typography>
        <MenuItem>
          <ListItemText>Posts & Activity</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Job Posting Account</ListItemText>
        </MenuItem>

        <Divider />
        <MenuItem onClick={closeMenu}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText onClick={handleLogout}>Sign Out</ListItemText>
        </MenuItem>
      </Menu>

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
            overflowY: "auto",
          },
        }}
      >
        <BusinessMenu />
      </Popover>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
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
                py: 1.5,
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
              onClick={() => router.push("/prem")}
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

      {/* Mobile Search Drawer */}
      <Drawer
        anchor="top"
        open={searchDrawerOpen}
        onClose={() => setSearchDrawerOpen(false)}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <IconButton onClick={() => setSearchDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <SearchBar>
              <Search sx={{ color: muiTheme.palette.text.secondary, mr: 1 }} />
              <InputBase
                placeholder="Search for jobs, people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    await handleSearch();
                  }
                }}
                autoFocus
                sx={{
                  color: muiTheme.palette.text.primary,
                  fontSize: "0.85rem",
                  width: "100%",
                }}
              />
            </SearchBar>

            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{ minWidth: "80px" }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Search Results */}
      <SearchResults />
    </AppBar>
  );
};

export default Navbar;
