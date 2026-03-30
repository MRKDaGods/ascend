"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Button,
  InputBase,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Search,
  History,
  Bookmark,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSearchStore } from "../stores/useSearchStore";

// Styled components
const SearchContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "30px",
  padding: "4px 10px",
}));

const SearchDropdown = styled(Paper)(({ theme }) => ({
  width: "300px",
  maxHeight: "400px",
  overflow: "auto",
  marginTop: "5px",
  borderRadius: "8px",
  boxShadow: theme.shadows[3],
  zIndex: 1200,
}));

const SearchListItem = styled(ListItem)(({ theme }) => ({
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
  },
}));

const SearchListHeader = styled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  fontWeight: 600,
  padding: "8px 16px",
  lineHeight: "32px",
}));

// Job titles data
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
  "Sales Manager",
  "Marketing Manager",
  "Business Analyst",
  "Graphic Designer",
  "Data Analyst",
  "System Administrator",
  "Network Engineer",
  "Database Administrator",
  "Web Developer",
  "Mobile Developer",
];

interface SearchBarProps {
  isSmallScreen: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isSmallScreen }) => {
  const router = useRouter();
  const { recentSearches, addSearch, setRecentSearches } = useSearchStore();
  const [searchParams, setSearchParams] = useState({ title: "", location: "" });
  const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("recentJobSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, [setRecentSearches]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
      const filtered = jobTitles.filter((title) =>
        title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTitles(filtered);
      setShowTitleDropdown(true);
    }
  };

  const handleSearch = () => {
    addSearch({ job: searchParams.title, location: searchParams.location });
    router.push(
      `/jobs/search?keyword=${encodeURIComponent(
        searchParams.title
      )}&location=${encodeURIComponent(searchParams.location)}`
    );
  };

  const handleTitleClick = (title: string) => {
    setSearchParams((prev) => ({ ...prev, title }));
    setShowTitleDropdown(false);
  };

  const getRecommendedTitles = (): string[] => {
    if (!searchParams.title) {
      return jobTitles.slice(0, 5); // Show top 5 job titles when empty
    }
    return filteredTitles.slice(0, 5); // Show top 5 filtered results
  };

  const getRecentTitleSearches = (): string[] => {
    return recentSearches
      .map((search) => search.job)
      .filter((job, index, self) => job && self.indexOf(job) === index)
      .slice(0, 5); // Only show the 5 most recent unique job searches
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowTitleDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, searchInputRef]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "100%",
        flexDirection: isSmallScreen ? "column" : "row",
      }}
    >
      {/* Job Title Search */}
      <Box sx={{ position: "relative", width: isSmallScreen ? "100%" : "270px" }}>
        <SearchContainer sx={{ width: "100%" }}>
          <Search sx={{ color: "text.secondary", mr: 1 }} />
          <InputBase
            name="title"
            placeholder="Job title"
            value={searchParams.title}
            onChange={handleSearchChange}
            onFocus={() => setShowTitleDropdown(true)}
            inputRef={searchInputRef}
            sx={{ fontSize: "0.85rem", width: "100%" }}
          />
        </SearchContainer>

        {showTitleDropdown && (
          <Box
            sx={{ 
              position: "absolute", 
              width: "100%", 
              zIndex: 1000 
            }}
            ref={dropdownRef}
          >
            <SearchDropdown sx={{ width: "100%" }}>
              {getRecentTitleSearches().length > 0 && (
                <>
                  <SearchListHeader>Recent Searches</SearchListHeader>
                  <List disablePadding>
                    {getRecentTitleSearches().map((title, index) => (
                      <SearchListItem
                        key={`recent-${index}`}
                        onClick={() => handleTitleClick(title)}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <History fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={title} 
                          primaryTypographyProps={{ 
                            noWrap: true,
                            sx: { fontSize: "0.9rem" } 
                          }}
                        />
                      </SearchListItem>
                    ))}
                  </List>
                </>
              )}

              <SearchListHeader>Recommended</SearchListHeader>
              <List disablePadding>
                {getRecommendedTitles().map((title, index) => (
                  <SearchListItem
                    key={`recommended-${index}`}
                    onClick={() => handleTitleClick(title)}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Bookmark fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={title} 
                      primaryTypographyProps={{ 
                        noWrap: true,
                        sx: { fontSize: "0.9rem" }
                      }}
                    />
                  </SearchListItem>
                ))}
              </List>
            </SearchDropdown>
          </Box>
        )}
      </Box>

      {/* Location Search */}
      <SearchContainer sx={{ width: isSmallScreen ? "100%" : "270px" }}>
        <Search sx={{ color: "text.secondary", mr: 1 }} />
        <InputBase
          name="location"
          placeholder="Location"
          value={searchParams.location}
          onChange={handleSearchChange}
          sx={{ fontSize: "0.85rem", width: "100%" }}
        />
      </SearchContainer>

      {/* Search Button */}
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{
          borderRadius: "20px",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          textTransform: "none",
          fontWeight: 600,
          px: 2.5,
          width: isSmallScreen ? "100%" : "auto",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;