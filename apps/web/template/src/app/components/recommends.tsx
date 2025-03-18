"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const jobSearches = ["marketing manager", "hr", "legal", "sales", "amazon", "google", "analyst"];

const Recommends = () => {
  const router = useRouter(); // Initialize router
  const [selectedSearches, setSelectedSearches] = useState<{ job: string; location: string }[]>([]);
  const [showRecommends, setShowRecommends] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  // Load saved searches from localStorage on mount
  useEffect(() => {
    const storedSearches = localStorage.getItem("recentJobSearches");
    if (storedSearches) {
      setSelectedSearches(JSON.parse(storedSearches));
    }
  }, []);

  // Save to localStorage whenever selectedSearches changes
  useEffect(() => {
    localStorage.setItem("recentJobSearches", JSON.stringify(selectedSearches));
  }, [selectedSearches]);

  // Handle selecting a job search
  const handleSelectSearch = (job: string) => {
    const newSearch = { job, location: "Egypt" };

    // Prevent duplicates in recent searches
    setSelectedSearches((prev) => {
      const isDuplicate = prev.some((search) => search.job === job);
      if (!isDuplicate) {
        return [...prev, newSearch];
      }
      return prev;
    });

    // Navigate to the search page
    router.push(`/search?job=${encodeURIComponent(job)}`);
  };

  // Handle clearing recent searches (after confirmation)
  const handleConfirmClear = () => {
    setSelectedSearches([]);
    localStorage.removeItem("recentJobSearches"); // Remove from localStorage
    setOpenDialog(false);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", my: 2 }}>
      {/* Suggested Job Searches Card */}
      {showRecommends && (
        <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Suggested job searches
              </Typography>
              <IconButton onClick={() => setShowRecommends(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
              {jobSearches.map((job, index) => (
                <Chip
                  key={index}
                  icon={<SearchIcon fontSize="small" />}
                  label={job}
                  variant="outlined"
                  sx={{
                    borderColor: "#0073b1",
                    color: "#0073b1",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#e8f4fa" },
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectSearch(job)} // Click to route
                  clickable
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Recent Job Searches Card */}
      {selectedSearches.length > 0 && (
        <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3, mt: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Recent job searches
              </Typography>
              <Button onClick={() => setOpenDialog(true)} size="small" sx={{ textTransform: "none" }}>
                Clear
              </Button>
            </Box>

            {selectedSearches.map((search, index) => (
              <Box
                key={index}
                mt={1}
                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" }, p: 1, borderRadius: 1 }}
                onClick={() => handleSelectSearch(search.job)} // Click to route
              >
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#0073b1" }}>
                  {search.job}
                </Typography>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  {search.location}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Clear Search History Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Clear search history?</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpenDialog(false)}
          sx={{ position: "absolute", right: 8, top: 8, color: "gray" }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "gray" }}>
            Your search history is only visible to you, and it helps us to show you better results.
            Are you sure you want to clear it?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleConfirmClear}
            variant="outlined"
            sx={{ borderColor: "#0073b1", color: "#0073b1", borderRadius: 5 }}
          >
            Clear
          </Button>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="contained"
            sx={{ backgroundColor: "#0073b1", borderRadius: 5 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Recommends;
