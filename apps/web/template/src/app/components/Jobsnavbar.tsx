// Updated JobsNavbar.tsx
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
  Button,
  Paper,
  InputBase,
  Badge,
  useMediaQuery,
  Divider
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Home, Work, Chat, Notifications, Search, MoreVert } from "@mui/icons-material";
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
  padding: '4px 10px',
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
  const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);
  const [searchParams, setSearchParams] = useState({ title: "", location: "" });
  const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
  const { recentSearches, addSearch, setRecentSearches } = useSearchStore();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const openMore = Boolean(moreAnchorEl);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleMoreOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setMoreAnchorEl(null);
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
    router.push(`/search?keyword=${searchParams.title}&location=${searchParams.location}`);
  };

  if (!isClient) return null;

  return (
    <AppBar elevation={0} sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderBottom: `1px solid ${theme.palette.divider}`, position: "sticky" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexDirection: isSmallScreen ? 'column' : 'row', alignItems: isSmallScreen ? 'center' : 'initial' }}>

        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
          <Typography variant="h5" color="primary" fontWeight="bold" sx={{ cursor: "pointer" }} onClick={() => router.push("/feed")}>
            Ascend
          </Typography>
        </Box>

        {/* CENTER */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 2, gap: 1, marginY: 1, flexDirection: isSmallScreen ? 'column' : 'row' }}>
          <SearchContainer sx={{ width: isSmallScreen ? '130px' : '300px' }}>
            <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
            <InputBase name="title" placeholder="Job title" value={searchParams.title} onChange={handleSearchChange} sx={{ fontSize: "0.85rem", width: "100%" }} />
          </SearchContainer>
          <SearchContainer sx={{ width: isSmallScreen ? '130px' : '300px' }}>
            <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
            <InputBase name="location" placeholder="Location" value={searchParams.location} onChange={handleSearchChange} sx={{ fontSize: "0.85rem", width: "100%" }} />
          </SearchContainer>
          <Button variant="contained" onClick={handleSearch} sx={{ borderRadius: 30, textTransform: 'none', backgroundColor: "#0a66c2", px: 3, py: 1 }}>Search</Button>
        </Box>

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isSmallScreen ? (
            <>
              <IconButton onClick={handleMoreOpen}><MoreVert /></IconButton>
              <Menu anchorEl={moreAnchorEl} open={openMore} onClose={handleMoreClose}>
                <MenuItem onClick={() => router.push("/for-business")}>For Business</MenuItem>
                <Divider />
                <MenuItem onClick={() => alert('Premium Coming Soon')}>Try Premium</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button variant="text" onClick={() => router.push("/for-business")} sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.875rem", color: theme.palette.text.primary }}>
                For Business
              </Button>
              <Button variant="contained" sx={{ backgroundColor: "#FFC107", color: "#000", textTransform: "none", borderRadius: 999, fontWeight: 600, px: 2.5, py: 1, fontSize: "0.875rem" }}>
                Try Premium
              </Button>
            </>
          )}

          <NavIconButton active={pathname === "/feed"} onClick={() => router.push("/feed")}><Home /></NavIconButton>
          <NavIconButton active={pathname === "/jobs"} onClick={() => router.push("/jobs")}><Work /></NavIconButton>
          <NavIconButton active={pathname === "/messages"} onClick={() => router.push("/messages")}><Chat /></NavIconButton>
          <NavIconButton active={pathname === "/notifications"} onClick={() => router.push("/notifications")}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </NavIconButton>
          <Avatar sx={{ width: 30, height: 30 }} src={userData?.profilePhoto} alt={userData?.name} onClick={handleMenuOpen} />
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default JobsNavbar;
