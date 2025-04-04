"use client";
import React, { useState } from "react";
import UserPost from "@/app/components/UserPost";
import PostDialog from "@/app/components/PostDialog";
import DeletePostDialog from "@/app/components/DeletePostDialog";
import { usePostStore } from "@/app/stores/usePostStore";
import { Typography, Box } from "@mui/material";

const EditDelete = () => {
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

export default EditDelete;
