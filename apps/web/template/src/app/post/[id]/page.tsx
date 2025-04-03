"use client";

import { useParams } from "next/navigation";
import React from "react";
import { usePostStore } from "../../stores/usePostStore";
import UserPost from "../../components/UserPost";
import Navbar from "../../components/Navbar";
import { Typography, Box } from "@mui/material";

const FullPostPage: React.FC = () => {
  const { id } = useParams();
  const { posts } = usePostStore();
  const postId = parseInt(id as string, 10);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">Post not found.</Typography>
      </Box>
    );
  }

  return (
    <>
    <Navbar />
    <Box sx={{
      mb: 2,
      borderRadius: 3,
      maxWidth: "580px",
      margin: "0 auto",
    }}>
      <UserPost post={post} />
    </Box>
    </>
  );
};

export default FullPostPage;
