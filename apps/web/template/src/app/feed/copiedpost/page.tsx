"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { usePostStore, PostType } from "@/app/stores/usePostStore";
import { Box, Typography, Snackbar } from "@mui/material";

const CopyPostPage = () => {
  const searchParams = useSearchParams();
  const postIdParam = searchParams.get("id");
  const postId = postIdParam ? parseInt(postIdParam) : null;

  const { posts } = usePostStore();
  const [post, setPost] = useState<PostType | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (postId) {
      const found = posts.find((p) => p.id === postId);
      setPost(found ?? null); // Set the found post or null if not found
    }
  }, [postId, posts]);

  // Copy link to clipboard and show snackbar
  const handleCopyLink = () => {
    const link = `${window.location.origin}/copypost?id=${postId}`;
    navigator.clipboard.writeText(link); // Copy link to clipboard
    setOpenSnackbar(true); // Show the success notification
  };

  return (
    <>
      <Navbar />
      {post ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            You can now share this post!
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Here's the link to the post:
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f4f4f4",
              padding: "10px",
              borderRadius: "4px",
              maxWidth: "80%",
              wordBreak: "break-word",
            }}
          >
            <Typography sx={{ flex: 1 }}>{`${window.location.origin}/copypost?id=${postId}`}</Typography>
            <button onClick={handleCopyLink} style={{ marginLeft: "10px" }}>
              Copy Link
            </button>
          </Box>
        </Box>
      ) : (
        <p style={{ textAlign: "center", marginTop: 50 }}>Hey! Post not found.</p>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Link copied to clipboard!"
      />
    </>
  );
};

export default CopyPostPage;
