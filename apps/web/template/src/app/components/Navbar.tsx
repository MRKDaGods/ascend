"use client";

import React, { useState } from "react";
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
} from "@mui/icons-material";
import { useThemeStore } from "../stores/useThemeStore";
import { useRouter, usePathname } from "next/navigation";
import { useMenuStore } from "../stores/useMenuStore";
import { useNotificationStore } from "../stores/useNotificationStore";
import { useProfileStore } from "../stores/useProfileStore";
import BusinessMenu from "./BusinessMenu"; // ✅ Import BusinessMenu

import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

const SearchBar = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "30px",
  padding: "6px 14px",
  marginLeft: 20,
  width: "270px",
}));

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
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "#eaeaea",
  },
}));

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const muiTheme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { anchorEl, setAnchorEl, closeMenu } = useMenuStore();
  const { notifications } = useNotificationStore();
  const unseenCount = notifications.filter((n) => !n.is_read).length;

  const userData = useProfileStore((state) => state.userData);
  const fullName = userData ? `${userData.first_name} ${userData.last_name}` : "User";
  const profilePicture = userData?.profile_picture_url || "/default-avatar.png";

  // ✅ Business Menu Popover logic
  const [businessAnchorEl, setBusinessAnchorEl] = useState<null | HTMLElement>(null);
  const businessMenuOpen = Boolean(businessAnchorEl);
  
  const handleBusinessClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBusinessAnchorEl(event.currentTarget);
  };

  const handleBusinessClose = () => {
    setBusinessAnchorEl(null);
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
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src="/logoIcon.png" alt="Ascend" style={{ height: 36, borderRadius: 6 }} />
          <SearchBar>
            <Search sx={{ color: muiTheme.palette.text.secondary, mr: 1 }} />
            <InputBase
              placeholder="Search for jobs, people..."
              sx={{
                color: muiTheme.palette.text.primary,
                fontSize: "0.85rem",
                width: "100%",
              }}
            />
          </SearchBar>
        </Box>

        {/* CENTER */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {[{ icon: <Home />, route: "/feed", label: "Home" }, { icon: <People />, route: "/network", label: "My Network" }, { icon: <Work />, route: "/jobs", label: "Jobs" }, { icon: <Message />, route: "/chat", label: "Messaging" }, { icon: <Notifications />, route: "/notif", label: "Notifications" }].map(({ icon, route, label }, i) => (
            <Tooltip key={i} title={label}>
              <NavIconButton onClick={() => router.push(route)} active={pathname === route}>
                {label === "Notifications" && unseenCount > 0 ? (
                  <Badge badgeContent={unseenCount} color="error">
                    {React.cloneElement(icon, { sx: { color: muiTheme.palette.text.secondary } })}
                  </Badge>
                ) : (
                  React.cloneElement(icon, { sx: { color: muiTheme.palette.text.secondary } })
                )}
              </NavIconButton>
            </Tooltip>
          ))}
        </Box>

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton onClick={toggleTheme}>
              {theme === "dark" ? (
                <LightMode sx={{ color: "#ffeb3b" }} />
              ) : (
                <DarkMode sx={{ color: "#333" }} />
              )}
            </IconButton>
          </Tooltip>

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

          {/* Dropdown Menu */}
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
              <Avatar src={profilePicture} sx={{ width: 58, height: 58, mx: "auto" }} />
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
            <Typography px={2} mt={1} fontSize="0.75rem" fontWeight={700} color="gray">
              Account
            </Typography>
            <MenuItem><ListItemText>Try Premium</ListItemText></MenuItem>
            <MenuItem>
              <ListItemText onClick={() => router.push("/authen/Settings")}>
                Settings & Privacy
              </ListItemText>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            </MenuItem>

            <Divider />
            <Typography px={2} mt={1} fontSize="0.75rem" fontWeight={700} color="gray">
              Manage
            </Typography>
            <MenuItem><ListItemText>Posts & Activity</ListItemText></MenuItem>
            <MenuItem><ListItemText>Job Posting Account</ListItemText></MenuItem>

            <Divider />
            <MenuItem onClick={closeMenu}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText onClick={() => router.push("/authen")}>Sign Out</ListItemText>
            </MenuItem>
          </Menu>

          {/* Business Button */}
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
            PaperProps={{ sx: { width: 700, mt: 1 } }}
          >
            <BusinessMenu />
          </Popover>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FFC107",
              color: "#000",
              textTransform: "none",
              borderRadius: "999px",
              fontWeight: 600,
              px: 2.5,
              "&:hover": {
                backgroundColor: "#D4AF37",
              },
            }}
          >
            Try Premium Free
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
