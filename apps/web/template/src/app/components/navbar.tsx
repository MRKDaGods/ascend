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
} from "@mui/material";
import { Home, Work, Chat, Notifications } from "@mui/icons-material";
import { useSearchStore } from "../store/useSearchStore";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  profilePhoto: string;
  coverPhoto: string;
  role: string;
  entity: string;
  location: string;
}

const jobTitles = [
  "Software Engineer", "Product Manager", "Data Scientist", "UX Designer",
  "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "Project Manager", "QA Engineer", "DevOps Engineer", "Sales Manager",
  "Marketing Manager", "Business Analyst", "Graphic Designer", "Data Analyst",
  "System Administrator", "Network Engineer", "Database Administrator",
  "Web Developer", "Mobile Developer"
];

const Navbar: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchParams, setSearchParams] = useState({ title: "", location: "" });
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
  const { recentSearches, addSearch } = useSearchStore();
  const open = Boolean(anchorEl);
  const router = useRouter();

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
  }, []);

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
      `/search?job=${encodeURIComponent(searchParams.title)}&location=${encodeURIComponent(searchParams.location)}`
    );
  };

  if (!isClient) return null;

  return (
    <AppBar position="fixed" color="default" sx={{ boxShadow: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography variant="h6" sx={{ fontWeight: "bold", fontFamily: "'Segoe UI', sans-serif" }}>
          LinkedIn
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f3f4f6",
            borderRadius: "24px",
            px: 2,
            py: 0.5,
            gap: 1.5,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            flexGrow: 1,
            maxWidth: 700,
            mx: 2,
            position: "relative",
          }}
        >
          <TextField
            name="title"
            placeholder="Job title or skill"
            variant="standard"
            value={searchParams.title}
            onChange={handleSearchChange}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setTimeout(() => setIsTitleFocused(false), 200)}
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: "0.9rem", px: 1.5, py: 0.75 },
            }}
            sx={{ flex: 1 }}
          />
          {isTitleFocused && (recentSearches.length > 0 || filteredTitles.length > 0) && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 10,
                maxHeight: 200,
                overflowY: "auto",
                mt: 1,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <List>
                {filteredTitles.length > 0 && (
                  <div>
                    <Typography sx={{ px: 2, py: 1, fontWeight: 'bold' }}>Suggested Titles</Typography>
                    {filteredTitles.map((title, index) => (
                      <ListItem
                        key={index}
                        component="div"
                        onClick={() => {
                          setSearchParams({ title, location: searchParams.location });
                          setIsTitleFocused(false);
                        }}
                        sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }}
                      >
                        <ListItemText primary={title} />
                      </ListItem>
                    ))}
                  </div>
                )}

                {recentSearches.length > 0 && (
                  <div>
                    <Typography sx={{ px: 2, py: 1, fontWeight: 'bold' }}>Recent Searches</Typography>
                    {recentSearches.map((search, index) => (
                      <ListItem
                        key={index}
                        component="div"
                        onClick={() => {
                          setSearchParams({ title: search.job, location: search.location });
                          setIsTitleFocused(false);
                        }}
                        sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }}
                      >
                        <ListItemText primary={search.job} secondary={search.location} />
                      </ListItem>
                    ))}
                  </div>
                )}
              </List>
            </Paper>
          )}

          <TextField
            name="location"
            placeholder="Location"
            variant="standard"
            value={searchParams.location}
            onChange={handleSearchChange}
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: "0.9rem", px: 1.5, py: 0.75 },
            }}
            sx={{ flex: 1 }}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              px: 3,
              py: 1,
              fontWeight: 500,
              fontSize: "0.875rem",
              backgroundColor: "#0a66c2",
              ":hover": { backgroundColor: "#004182" },
            }}
          >
            Search
          </Button>
        </Box>

        {/* Right: Icons & Profile */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton><Home /></IconButton>
          <IconButton><Work /></IconButton>
          <IconButton><Chat /></IconButton>
          <IconButton><Notifications /></IconButton>
        </Box>

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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
