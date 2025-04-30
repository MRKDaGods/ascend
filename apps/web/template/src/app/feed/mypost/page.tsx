//Page: renders USERPOST to display the post

"use client";

import { useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Navbar from "@/app/components/Navbar";
import UserPost from "@/app/components/UserPost";
import DeletePost from "@/app/components/DeletePost";
import EditPost from "@/app/components/EditPost";
import { usePostStore } from "@/app/stores/usePostStore";

const MyPostPage = () => {
  const {
    lastUserPostId,
    fetchPostFromAPI,
    selectedPost,
    isLastPostDeleted,
  } = usePostStore();

  const theme = useTheme();

  useEffect(() => {
    if (lastUserPostId) {
      fetchPostFromAPI(lastUserPostId);
    }
  }, [lastUserPostId]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          margin: "0 auto",
          width: "100%",
          padding: 2,
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {isLastPostDeleted ? (
          <DeletePost />
        ) : selectedPost ? (
          <UserPost post={selectedPost} />
        ) : (
          <Typography
            textAlign="center"
            fontStyle="italic"
            color={theme.palette.text.secondary}
          >
            Loading...
          </Typography>
        )}
      </Box>
      <EditPost />
    </>
  );
};

export default MyPostPage;
