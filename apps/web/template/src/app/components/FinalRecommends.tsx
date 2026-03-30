'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchStore } from "../stores/useSearchStore";

const jobSearches = ["marketing manager", "hr", "legal", "sales", "amazon", "google", "analyst", "manager"];

const FinalRecommends = () => {
  const theme = useTheme();
  const router = useRouter();
  const { recentSearches, addSearch, clearSearches, setRecentSearches } = useSearchStore();
  const [showRecommends, setShowRecommends] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("recentJobSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, [setRecentSearches]);

  const handleSelectSearch = (job: string) => {
    const search = { job, location: "" };
    addSearch(search);
    router.push(
      `/jobs/search?keyword=${encodeURIComponent(job)}&location=&industry=&experience_level=&company=&salary_range_min=&salary_range_max=&page=1`
    );
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", my: 2 }}>
      {showRecommends && (
        <Card
          sx={{
            p: 2,
            boxShadow: 3,
            borderRadius: 3,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
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
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                    },
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
        <Card
          sx={{
            p: 2,
            boxShadow: 3,
            borderRadius: 3,
            mt: 2,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
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
                sx={{
                  cursor: "pointer",
                  p: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
                onClick={() => handleSelectSearch(search.job)}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
                  {search.job}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {search.location}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Clear search history?</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpenDialog(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.text.secondary,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
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
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              borderRadius: 5,
            }}
          >
            Clear
          </Button>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="contained"
            sx={{
              bgcolor: theme.palette.primary.main,
              borderRadius: 5,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinalRecommends;
