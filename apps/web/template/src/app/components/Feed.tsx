"use client";

import React from "react";
import { Box, Stack } from "@mui/material";
import Post from "./Post";
import { usePostStore, PostType } from "../store/usePostStore"; // ✅ Correct Import

const Feed: React.FC = () => {
  const { posts } = usePostStore(); // ✅ Fetch posts from Zustand store

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
      
      {/* ❌ Do NOT include <CreatePost /> here! It is handled in page.tsx */}
      
      {/* ✅ Posts List (Only Rendering Posts) */}
      <Stack spacing={2} sx={{ width: "100%", maxWidth: "700px", mt: 2 }}>
        {posts.length > 0 ? (
          posts.map((post: PostType) => <Post key={post.id} post={post} />)
        ) : (
          <Box sx={{ textAlign: "center", p: 3, color: "gray" }}>No posts to show. Follow users to see posts.</Box>
        )}
      </Stack>
    </Box>
  );
};

export default Feed;
