"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Stack,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { MoreHoriz, ThumbUp, Comment, Delete, Edit } from "@mui/icons-material";
import { usePostStore, PostType } from "../store/usePostStore";

const UserPost: React.FC<{ post: PostType }> = ({ post }) => {
  const theme = useTheme(); // ✅ Get MUI Theme
  const { deletePost, likePost, commentOnPost, likedPosts } = usePostStore();

  // ✅ State for 3-dots Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // ✅ State for Delete Confirmation Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleDeleteConfirm = () => {
    deletePost(post.id);
    setDeleteDialogOpen(false);
  };

  return (
    <Card
      sx={{
        mt: 2,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper, // ✅ Theme-based Background
        color: theme.palette.text.primary, // ✅ Theme-based Text Color
        p: 2,
        maxWidth: "700px",
        transition: "background-color 0.3s ease-in-out", // ✅ Smooth Theme Transition
      }}
    >
      {/* ✅ Post Header (User Info + 3-Dots Menu) */}
      <CardHeader
        avatar={<Avatar src={post.profilePic} />}
        title={
          <Typography fontWeight="bold">
            Ascend Developer • <span style={{ color: theme.palette.text.secondary, fontSize: "0.9rem" }}>You</span>
          </Typography>
        }
        subheader={
          <Typography color={theme.palette.text.secondary} fontSize="0.9rem">
            Now • <span style={{ fontSize: "1rem" }}>👥</span>
          </Typography>
        }
        action={
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreHoriz sx={{ color: theme.palette.text.primary }} />
            </IconButton>
            {/* ✅ 3-Dots Menu (Edit & Delete) */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>
                <Edit sx={{ color: theme.palette.text.primary, mr: 1 }} /> Edit Post
              </MenuItem>
              <MenuItem onClick={() => setDeleteDialogOpen(true)}>
                <Delete sx={{ color: "red", mr: 1 }} /> Delete Post
              </MenuItem>
            </Menu>
          </>
        }
      />

      {/* ✅ Post Content */}
      <CardContent>
        <Typography variant="body1" sx={{ fontSize: "1.2rem", color: theme.palette.text.primary }}>
          {post.content}
        </Typography>
      </CardContent>

      {/* ✅ Like & Comment Buttons */}
      <Stack direction="row" justifyContent="center" sx={{ p: 1 }}>
        <Button
          startIcon={<ThumbUp />}
          sx={{
            textTransform: "none",
            color: likedPosts.includes(post.id) ? "#0a66c2" : theme.palette.text.secondary,
            fontWeight: "bold",
          }}
          onClick={() => likePost(post.id)}
        >
          Like
        </Button>
        <Button
          startIcon={<Comment />}
          sx={{ textTransform: "none", color: theme.palette.text.secondary, fontWeight: "bold", ml: 4 }}
          onClick={() => console.log("Comment Clicked")}
        >
          Comment
        </Button>
      </Stack>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ color: theme.palette.text.primary }}>
          Are you sure you want to delete this post?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: theme.palette.text.secondary }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default UserPost;
