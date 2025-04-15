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
  Apps,
  Search,
  ExpandMore,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useThemeStore } from "../stores/useThemeStore";
import { useRouter } from "next/navigation";
import { useMenuStore } from "../stores/useMenuStore";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNotificationRedirect } from "../utils/handleNotificationRedirect";

// ✅ Define the expected shape of notification
type NavbarProps = {
    notification?: {
      payload: {
        link: string;
      };
    };
  };
  

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

const Navbar: React.FC<NavbarProps> = ({ notification }) => {
  const { theme, toggleTheme } = useThemeStore();
  const muiTheme = useTheme();
  const router = useRouter();
  const { anchorEl, setAnchorEl, closeMenu } = useMenuStore();
  const openMenu = Boolean(anchorEl);
  const redirectToNotification = useNotificationRedirect();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: muiTheme.palette.background.default,
        color: muiTheme.palette.text.primary,
        boxShadow: "none",
        borderBottom: `1px solid ${muiTheme.palette.mode === "dark" ? "#444" : "#ddd"}`,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section (Logo + Search) */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src="/initial-logo.jpg" alt="Ascend" style={{ height: 35 }} />
          <SearchBar>
            <Search sx={{ color: muiTheme.palette.text.primary, marginRight: 1 }} />
            <InputBase placeholder="Search" sx={{ color: muiTheme.palette.text.primary, width: "100%" }} />
          </SearchBar>
        </Box>

        {/* Center Navigation Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Tooltip title="Home">
            <IconButton onClick={() => router.push("/feed")}>
              <Home sx={{ color: muiTheme.palette.text.secondary }} />
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
            <IconButton onClick={() => router.push("/chat")}>
              <Message sx={{ color: muiTheme.palette.text.secondary }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            {/* <IconButton onClick={() => {
                if (notification) {
                    redirectToNotification(notification);
                }
                }}>
              <Badge color="error">
                <Notifications sx={{ color: muiTheme.palette.text.secondary }} />
              </Badge>
            </IconButton>
             */}
             <IconButton onClick={() => router.push("/notif")}>
              <Badge color="error">
                <Notifications sx={{ color: muiTheme.palette.text.secondary }} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton onClick={toggleTheme}>
              {theme === "dark" ? <LightMode sx={{ color: "#ffea00" }} /> : <DarkMode sx={{ color: "#555" }} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Me">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar src="/man.jpg" sx={{ border: `2px solid ${theme === "dark" ? "#fff" : "#000"}` }} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={closeMenu}
            PaperProps={{ elevation: 4, sx: { width: 230, mt: 1 } }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box px={2} py={1.5} display="flex" flexDirection="column" alignItems="center">
              <Avatar src="/man.jpg" sx={{ width: 56, height: 56 }} />
              <Typography fontWeight="bold" mt={1}>Developing Ascend</Typography>
              <Button onClick={()=>router.push("/profile")} variant="outlined" sx={{ mt: 1, textTransform: "none", fontWeight: "bold" }}>
                View Profile
              </Button>
            </Box>

            <Divider sx={{ my: 1 }} />
            <Typography sx={{ px: 2, fontSize: "0.75rem", fontWeight: "bold", color: "gray" }}>Account</Typography>
            <MenuItem><ListItemText>Try 1 month of Premium</ListItemText></MenuItem>
            <MenuItem>
              <ListItemText>Settings & Privacy</ListItemText>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            </MenuItem>

            <Divider sx={{ my: 1 }} />
            <Typography sx={{ px: 2, fontSize: "0.75rem", fontWeight: "bold", color: "gray" }}>Manage</Typography>
            <MenuItem><ListItemText>Posts & Activity</ListItemText></MenuItem>
            <MenuItem><ListItemText>Job Posting Account</ListItemText></MenuItem>

            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={closeMenu}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Sign Out</ListItemText>
            </MenuItem>
          </Menu>

          <Button sx={{ color: muiTheme.palette.text.primary, textTransform: "none" }} endIcon={<ExpandMore />}>
            For Business
          </Button>

          <Button variant="text" sx={{ color: theme === "dark" ? "#ffcc80" : "#915907", textTransform: "none" }}>
            Try Premium for EGP0
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
