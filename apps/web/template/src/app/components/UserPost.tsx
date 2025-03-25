"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
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

const renderWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const parts = text.split(urlRegex);

  return parts.map((part, index) =>
    urlRegex.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#0a66c2", textDecoration: "underline" }}
      >
        {part}
      </a>
    ) : (
      <span key={index}>{part}</span>
    )
  );
};

const UserPost: React.FC<{ post: PostType }> = ({ post }) => {
  const theme = useTheme();
  const {
    deletePost,
    likePost,
    commentOnPost,
    likedPosts,
    setEditingPost,
  } = usePostStore();
  

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleDeleteConfirm = () => {
    deletePost(post.id);
    setDeleteDialogOpen(false);
  };

  return (
    <Box sx={{ maxWidth: "580px", mx: "auto", mt: 2 }}>
      <Card
        sx={{
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          px: 2,
          py: 1,
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        {/* Post Header */}
        <CardHeader
          avatar={<Avatar src={post.profilePic} sx={{ width: 44, height: 44 }} />}
          title={
            <Typography fontWeight="bold">
              Ascend Developer{" "}
              <Typography
                component="span"
                sx={{ color: theme.palette.text.secondary, fontSize: "0.875rem", ml: 1 }}
              >
                • You
              </Typography>
            </Typography>
          }
          subheader={
            <Typography color={theme.palette.text.secondary} fontSize="0.875rem">
              Now • <span role="img" aria-label="connections">👥</span>
            </Typography>
          }
          action={
            <>
              <IconButton onClick={handleMenuOpen}>
                <MoreHoriz sx={{ color: theme.palette.text.primary }} />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem
                  onClick={() => {
                    setEditingPost(post); // ⬅️ Trigger edit mode
                    handleMenuClose();    // Close the menu
                  }}
                >
                  <Edit sx={{ mr: 1 }} /> Edit Post
                </MenuItem>
                <MenuItem onClick={() => setDeleteDialogOpen(true)}>
                  <Delete sx={{ color: "red", mr: 1 }} /> Delete Post
                </MenuItem>
              </Menu>
            </>
          }
        />

        {/* Post Content */}
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body1" fontSize="1rem" sx={{ color: theme.palette.text.primary }}>
            {renderWithLinks(post.content)}
          </Typography>
        </CardContent>

        {/* ✅ Post Media (if available) */}
        {post.image && (
          <CardMedia
            component="img"
            image={post.image}
            alt="Uploaded Post Image"
            sx={{ maxHeight: 500, objectFit: "cover", borderRadius: 2, mx: 2 }}
          />
        )}
        {post.video && (
          <CardMedia
            component="video"
            src={post.video}
            controls
            sx={{ maxHeight: 500, borderRadius: 2, mx: 2 }}
          />
        )}


        {/* Like & Comment Buttons */}
        <Stack direction="row" justifyContent="center" spacing={4} sx={{ pt: 1 }}>
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
            sx={{
              textTransform: "none",
              color: theme.palette.text.secondary,
              fontWeight: "bold",
            }}
            onClick={() => console.log("Comment Clicked")}
          >
            Comment
          </Button>
        </Stack>
      </Card>

      {/* Delete Confirmation Dialog */}
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
    </Box>
  );
};

export default UserPost;
