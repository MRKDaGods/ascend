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
  Menu,
  MenuItem,
  Divider,
  ListItemText,
  ListItemIcon,
  Typography,
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
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNotificationStore } from "../stores/useNotificationStore";

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
}));

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
  const openMenu = Boolean(anchorEl);
  const { notifications } = useNotificationStore();
  const unseenCount = notifications.filter((n) => !n.is_read).length;

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
        {/* 🔹 LEFT */}
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

        {/* 🔹 CENTER */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {[
            { icon: <Home />, route: "/feed", label: "Home" },
            { icon: <People />, route: "/network", label: "My Network" },
            { icon: <Work />, route: "/jobs", label: "Jobs" },
            { icon: <Message />, route: "/chat", label: "Messaging" },
            { icon: <Notifications />, route: "/notif", label: "Notifications" },
          ].map(({ icon, route, label }, i) => (
            <Tooltip key={i} title={label}>
              <NavIconButton onClick={() => router.push(route)} active={pathname === route}>
                {label === "Notifications" && unseenCount > 0 ? (
                  <Badge badgeContent={unseenCount} color="error">
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

        {/* 🔹 RIGHT */}
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

          <Tooltip title="Me">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar
                src="/man.jpg"
                sx={{
                  border: `2px solid ${theme === "dark" ? "#fff" : "#000"}`,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
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
              <Avatar src="/man.jpg" sx={{ width: 58, height: 58, mx: "auto" }} />
              <Typography fontWeight={600} mt={1}>Developing Ascend</Typography>
              <Button
                
                onClick={() => {
                  closeMenu();
                  router.push("/profile")}
                }
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
              <ListItemText onClick={() => router.push("/authen/Settings")}>Settings & Privacy</ListItemText>
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
              <ListItemText onClick={() => router.push("/authen")}
              >Sign Out</ListItemText>
            </MenuItem>
          </Menu>

          <Button
            sx={{ color: muiTheme.palette.text.primary, textTransform: "none", fontWeight: 500 }}
            endIcon={<ExpandMore />}
          >
            For Business
          </Button>

          <Button
          onClick={() => router.push("/premium")}
            variant="contained"
            sx={{
              backgroundColor: "#FFC107",
              color: "#000",
              textTransform: "none",
              borderRadius: "999px",
              fontWeight: 600,
              px: 2.5,
              "&:hover": {
                backgroundColor: "#D4AF37 ",
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
