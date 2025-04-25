"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Card, CardContent, Typography, Chip, IconButton,
  Button, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchStore } from "../store/useSearchStore";
import{useEffect} from "react";



const jobSearches = ["marketing manager", "hr", "legal", "sales", "amazon", "google", "analyst"];

const Recommends = () => {
  const router = useRouter();
  const { recentSearches, addSearch, clearSearches } = useSearchStore();
  const [showRecommends, setShowRecommends] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("recentJobSearches");
    if (stored) {
      useSearchStore.getState().setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const handleSelectSearch = (job: string) => {
    const search = { job, location: "Egypt" };
    addSearch(search);
    router.push(`/search?job=${encodeURIComponent(job)}`);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", my: 2 }}>
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
                  onClick={() => handleSelectSearch(job)}
                  clickable
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {recentSearches.length > 0 && (
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

            {recentSearches.map((search, index) => (
              <Box
                key={index}
                mt={1}
                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" }, p: 1, borderRadius: 1 }}
                onClick={() => handleSelectSearch(search.job)}
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

      {/* Dialog */}
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
            Your search history is only visible to you and helps us show better results.
            Are you sure you want to clear it?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => {
              clearSearches();
              setOpenDialog(false);
            }}
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
