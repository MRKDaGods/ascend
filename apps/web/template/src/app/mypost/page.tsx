"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import UserPost from "../components/UserPost";
import PostDialog from "../components/PostDialog";
import DeletePostDialog from "../components/DeletePostDialog";
import { usePostStore } from "../stores/usePostStore";
import { Typography, Box } from "@mui/material";

const MyPostPage = () => {
  const { posts, open, deletePost, isLastPostDeleted, setLastPostDeleted } = usePostStore();
  const userPosts = posts.filter((post) => post.isUserPost);
  const lastUserPost = userPosts[userPosts.length - 1];

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (lastUserPost) {
      deletePost(lastUserPost.id);
      setDeleteDialogOpen(false);
      setLastPostDeleted(true); // 🆕 trigger message
    }
  };

  return (
    <>
      <Navbar />
      

      {/* ✅ Post Removed Message */}
      {isLastPostDeleted ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography fontWeight="bold" fontSize="1.2rem">
            Post removed
          </Typography>
          <Typography color="gray">Post successfully deleted.</Typography>
        </Box>
      ) : (
        lastUserPost && (
          <UserPost
            post={lastUserPost}
            onDeleteClick={() => setDeleteDialogOpen(true)} // ✅ trigger confirmation
          />
        )
      )}

      {/* ✅ Edit Dialog */}
      {open && <PostDialog />}

      {/* ✅ Delete Confirmation Dialog */}
      <DeletePostDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default MyPostPage;
