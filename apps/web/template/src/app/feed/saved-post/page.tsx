"use client";

import React, { useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import Navbar from "@/app/components/Navbar";
import SavedPosts from "@/app/components/SavedPosts";
import { usePostStore } from "@/app/stores/usePostStore";

const SavePage = () => {
  const theme = useTheme();
  const { fetchSavedPostsAPI } = usePostStore();

  useEffect(() => {
    fetchSavedPostsAPI();
  }, [fetchSavedPostsAPI]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "100vh",
          pt: 2,
        }}
      >
        <SavedPosts />
      </Box>
    </>
  );
};

export default SavePage;
