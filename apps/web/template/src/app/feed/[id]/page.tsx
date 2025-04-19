"use client";

import React from "react";
import ConnectionPost from "../../components/ConnectionPost";
import Navbar from "../../components/Navbar";
import { Typography, Box } from "@mui/material";
import { useParams } from "next/navigation";
import { usePostStore } from "../../stores/usePostStore";

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
    <Navbar notification={{
        payload: {
          link: ""
        }
      }} />
    <br></br>
    <Box sx={{
      mb: 2,
      borderRadius: 3,
      maxWidth: "580px",
      margin: "0 auto",
    }}>
      <ConnectionPost post={post} />
    </Box>
    </>
  );
};

export default FullPostPage;
