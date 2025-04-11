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
  "Software Engineer", 
  "Product Manager", 
  "Data Scientist", 
  "UX Designer", 
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Project Manager",
  "QA Engineer",
  "DevOps Engineer",
  "sales manager",
  "marketing manager",
  "business analyst",
  "graphic designer",
  "data analyst",
  "system administrator",
  "network engineer",
  "database administrator",
  "web developer",
  "mobile developer"  
  // Add more job titles as needed
];

const Navbar: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchParams, setSearchParams] = useState({ title: "", location: "" });
  const [isTitleFocused, setIsTitleFocused] = useState(false); // Track focus on "title"
  const [filteredTitles, setFilteredTitles] = useState<string[]>([]); // Filtered job titles
  const { recentSearches, addSearch } = useSearchStore(); // Access recent searches from the store
  const open = Boolean(anchorEl);
  const router = useRouter(); // Initialize router

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
      // Filter job titles based on user input
      const filtered = jobTitles.filter((title) =>
        title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTitles(filtered);
    }
  };

  const handleSearch = () => {
    console.log("Search Params:", searchParams);
    addSearch({ job: searchParams.title, location: searchParams.location }); // Save search to recent searches
    router.push(`/search?job=${encodeURIComponent(searchParams.title)}&location=${encodeURIComponent(searchParams.location)}`);
  };

  if (!isClient) return null;

  return (
    <AppBar position="fixed" color="default" sx={{ boxShadow: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Logo */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          LinkedIn
        </Typography>

        {/* Center: Chic Search */}
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
            position: "relative", // For dropdown positioning
          }}
        >
          <TextField
            name="title"
            placeholder="Job title or skill"
            variant="standard"
            value={searchParams.title}
            onChange={handleSearchChange}
            onFocus={() => setIsTitleFocused(true)} // Show recent searches on focus
            onBlur={() => setTimeout(() => setIsTitleFocused(false), 200)} // Hide recent searches on blur
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: "0.9rem",
                px: 1.5,
                py: 0.75,
              },
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
                {/* Display Job Title Suggestions */}
                {filteredTitles.length > 0 && (
                  <div>
                    <Typography sx={{ px: 2, py: 1, fontWeight: 'bold' }}>Suggested Titles</Typography>
                    {filteredTitles.map((title, index) => (
                      <ListItem
                        key={index}
                        component="div"
                        onClick={() => {
                          setSearchParams({
                            title: title,
                            location: searchParams.location,
                          });
                          setIsTitleFocused(false);
                        }}
                        sx={{
                          cursor: "pointer", // Add pointer cursor to indicate clickability
                          "&:hover": {
                            backgroundColor: "#f0f0f0", // Optional: Add hover effect
                          },
                        }}
                      >
                        <ListItemText primary={title} />
                      </ListItem>
                    ))}
                  </div>
                )}

                {/* Display Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <Typography sx={{ px: 2, py: 1, fontWeight: 'bold' }}>Recent Searches</Typography>
                    {recentSearches.map((search, index) => (
                      <ListItem
                        key={index}
                        component="div" // Explicitly set the component to "div"
                        onClick={() => {
                          setSearchParams({
                            title: search.job,
                            location: search.location,
                          });
                          setIsTitleFocused(false);
                        }}
                        sx={{
                          cursor: "pointer", // Add pointer cursor to indicate clickability
                          "&:hover": {
                            backgroundColor: "#f0f0f0", // Optional: Add hover effect
                          },
                        }}
                      >
                        <ListItemText
                          primary={search.job}
                          secondary={search.location}
                        />
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
              sx: {
                fontSize: "0.9rem",
                px: 1.5,
                py: 0.75,
              },
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
              ":hover": {
                backgroundColor: "#004182",
              },
              
            }}
            
          >
            Search
          </Button>
        </Box>

        {/* Right: Navigation Icons & Profile */}
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
