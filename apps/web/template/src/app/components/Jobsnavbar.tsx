'use client';

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  InputBase,
  Badge,
  useMediaQuery
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Home, Work, Chat, Notifications, Search } from "@mui/icons-material";
import { useSearchStore } from "../store/useSearchStore";
import { useRouter, usePathname } from "next/navigation";

interface UserData {
  name: string;
  profilePhoto: string;
  coverPhoto: string;
  role: string;
  entity: string;
  location: string;
}

const SearchContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '30px',
  padding: '6px 14px',
  width: '270px',
}));

const NavIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
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

const jobTitles = [
  "Software Engineer", "Product Manager", "Data Scientist", "UX Designer",
  "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "Project Manager", "QA Engineer", "DevOps Engineer", "Sales Manager",
  "Marketing Manager", "Business Analyst", "Graphic Designer", "Data Analyst",
  "System Administrator", "Network Engineer", "Database Administrator",
  "Web Developer", "Mobile Developer"
];

const JobsNavbar: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchParams, setSearchParams] = useState({ title: "", location: "" });
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
  const { recentSearches, addSearch, setRecentSearches } = useSearchStore();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Detect small screens

  useEffect(() => {
    setIsClient(true);

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data: UserData = await response.json();
        setUserData(data);
        setSearchParams((prev) => ({
          ...prev,
          location: data.location || "",
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
      const filtered = jobTitles.filter((title) =>
        title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTitles(filtered);
    }
  };

  const handleSearch = () => {
    addSearch({ job: searchParams.title, location: searchParams.location });
    router.push(
      `/search?keyword=${searchParams.title}&location=${searchParams.location}&industry=&experience_level=&company=&salary_range_min=&salary_range_max=&page=1`
    );
  };

  if (!isClient) return null;

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: "sticky",
        margin: 0,
        padding: 0,
        mb: 0,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 0.25,
          flexDirection: isSmallScreen ? 'column' : 'row', // Stack elements vertically on small screens
          alignItems: isSmallScreen ? 'center' : 'initial', // Center the items on small screens
        }}
      >
        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
          <img
            src="/logoIcon.png"
            alt="Ascend"
            style={{ height: 36, borderRadius: 6 }}
          />
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

        {/* CENTER - Search fields */}
        <Box
  sx={{
    display: "flex",
    alignItems: isSmallScreen ? 'center' : 'flex-start', // Center on small screens, align left on larger screens
    gap: 2,
    flexGrow: 1,
    maxWidth: 700,
    marginX: 2,
    marginY: 1,
    flexDirection: isSmallScreen ? 'column' : 'row', // Stack search fields on small screens
  }}
>
  {/* Job Title Search Bar */}
  <SearchContainer>
    <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
    <InputBase
      name="title"
      placeholder="Job title or skill"
      value={searchParams.title}
      onChange={handleSearchChange}
      onFocus={() => setIsTitleFocused(true)}
      onBlur={() => setTimeout(() => setIsTitleFocused(false), 200)}
      sx={{ fontSize: "0.85rem", width: "100%" }}
    />
  </SearchContainer>

  {/* Only show Location Search Bar on larger screens */}
  {!isSmallScreen && (
    <SearchContainer>
      <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
      <InputBase
        name="location"
        placeholder="Location"
        value={searchParams.location}
        onChange={handleSearchChange}
        sx={{ fontSize: "0.85rem", width: "100%" }}
      />
    </SearchContainer>
  )}

  <Button
    variant="contained"
    onClick={handleSearch}
    sx={{
      borderRadius: "30px",
      textTransform: "none",
      px: 3,
      py: 1,
      fontWeight: 500,
      fontSize: "0.85rem",
      backgroundColor: "#0a66c2",
      ":hover": { backgroundColor: "#004182" },
    }}
  >
    Search
  </Button>

  {isTitleFocused && (recentSearches.length > 0 || filteredTitles.length > 0) && (
    <Paper
      sx={{
        position: "absolute",
        top: "56px",
        left: "30%",
        transform: "translateX(-50%)",
        zIndex: 10,
        width: 400,
        maxHeight: 300,
        overflowY: "auto",
        mt: 1,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <List>
        {filteredTitles.length > 0 && (
          <>
            <Typography sx={{ px: 2, py: 1, fontWeight: 'bold' }}>Suggested Titles</Typography>
            {filteredTitles.map((title, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  setSearchParams((prev) => ({ ...prev, title })); 
                  setIsTitleFocused(false);
                }}
                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }}
              >
                <ListItemText primary={title} />
              </ListItem>
            ))}
          </>
        )}
        {recentSearches.length > 0 && (
          <>
            <Typography sx={{ px: 2, py: 1, fontWeight: 'bold' }}>Recent Searches</Typography>
            {recentSearches.map((search, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  setSearchParams({ title: search.job, location: search.location });
                  setIsTitleFocused(false);
                }}
                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }}
              >
                <ListItemText primary={search.job} secondary={search.location} />
              </ListItem>
            ))}
          </>
        )}
      </List>
    </Paper>
  )}
</Box>


        {/* RIGHT - Icons and User Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="text"
            sx={{
              textTransform: "none",
              fontWeight: 600,
             fontSize: isSmallScreen ? "0.65rem" : "0.875rem",
              color: theme.palette.text.primary,
              ":hover": {
                backgroundColor: theme.palette.action.hover,
                borderRadius: "8px",
                px: isSmallScreen ? 0.5 : 2.5,  
                py: isSmallScreen ? 0.25 : 1,
              },
            }}
            onClick={() => router.push("/for-business")}
          >
            For Business
          </Button>

          <Button
  variant="contained"
  sx={{
    backgroundColor: "#FFC107",
    color: "#000",
    textTransform: "none",
    borderRadius: "999px",
    fontWeight: 600,
    px: isSmallScreen ? 1 : 2.5,  // Reduced padding for small screens
    py: isSmallScreen ? 0.25 : 1,   // Reduced vertical padding for small screens
    fontSize: isSmallScreen ? "0.65rem" : "0.875rem",  // Smaller font size on small screens
    "&:hover": {
      backgroundColor: "#D4AF37",
    },
    gap: 1,
  }}
>
  Try Premium 
</Button>


          <NavIconButton active={pathname === "/feed"} onClick={() => router.push("/feed")}>
            <Home />
          </NavIconButton>
          <NavIconButton active={pathname === "/jobs"} onClick={() => router.push("/jobs")}>
            <Work />
          </NavIconButton>
          <NavIconButton active={pathname === "/messages"} onClick={() => router.push("/messages")}>
            <Chat />
          </NavIconButton>
          <NavIconButton active={pathname === "/notifications"} onClick={() => router.push("/notifications")}>
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </NavIconButton>

          {userData ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <Avatar src={userData.profilePhoto} alt={userData.name} sx={{ width: 36, height: 36 }} />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem disabled>
                  <Typography variant="body1" fontWeight="bold">{userData.name}</Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="body2" color="textSecondary">
                    {userData.role} at {userData.entity}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>Settings & Privacy</MenuItem>
                <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <CircularProgress size={24} />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default JobsNavbar;
