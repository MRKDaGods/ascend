"use client";

import { useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Navbar from "@/app/components/Navbar";
import UserPost from "@/app/components/UserPost";
import DeletePost from "@/app/components/DeletePost";
import EditPost from "@/app/components/EditPost";
import { usePostStore } from "@/app/stores/usePostStore";

const RepostWithThoughtsPage = () => {
  const theme = useTheme();
  const {
    lastRepostId,
    fetchPostFromAPI,
    selectedPost,
    isLastPostDeleted,
  } = usePostStore();

  const isRepostFetched = selectedPost?.id === lastRepostId;

  useEffect(() => {
    if (lastRepostId && !isRepostFetched) {
      console.log("🧠 Fetching repost-with-thoughts:", lastRepostId);
      fetchPostFromAPI(lastRepostId);
    }
  }, [lastRepostId, isRepostFetched, fetchPostFromAPI]);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
        {isLastPostDeleted ? (
          <Typography textAlign="center" fontStyle="italic" color="text.secondary">
            Your repost with thoughts has been deleted.
          </Typography>
        ) : !selectedPost || !isRepostFetched ? (
          <Typography textAlign="center">Loading repost with thoughts...</Typography>
        ) : (
          <UserPost post={selectedPost} />
        )}
      </Box>

      <DeletePost />
      <EditPost />
    </Box>
  );
};

export default RepostWithThoughtsPage;
