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
import { usePostStore, PostType } from "../stores/usePostStore";

// ✅ Accept the onDeleteClick prop
const ConnectionPost: React.FC<{ post: PostType; onDeleteClick?: () => void }> = ({
  post,
  onDeleteClick,
}) => {
  const theme = useTheme();
  const { likePost, likedPosts } = usePostStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card
      sx={{
        mt: 2,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        p: 2,
        maxWidth: "700px",
        mx: "auto",
      }}
    >
      <CardHeader
        avatar={<Avatar src={post.profilePic} />}
        title={<Typography fontWeight="bold">{post.username}</Typography>}
        subheader={<Typography color="text.secondary" fontSize="0.9rem">{post.timestamp}</Typography>}
        action={
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreHoriz />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>
                <Edit sx={{ mr: 1 }} /> Edit Post
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  onDeleteClick?.(); // ✅ Trigger passed prop
                }}
              >
                <Delete sx={{ color: "red", mr: 1 }} /> Delete Post
              </MenuItem>
            </Menu>
          </>
        }
      />

      <CardContent>
        <Typography variant="body1" sx={{ fontSize: "1.1rem", mb: 1 }}>{post.content}</Typography>
        {post.image && (
          <Box
            component="img"
            src={post.image}
            alt="Post Media"
            sx={{ width: "100%", borderRadius: 2, maxHeight: 400, objectFit: "cover", mt: 1 }}
          />
        )}
        {post.video && (
          <Box
            component="video"
            src={post.video}
            controls
            sx={{ width: "100%", borderRadius: 2, maxHeight: 400, mt: 1 }}
          />
        )}
      </CardContent>

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
          sx={{
            textTransform: "none",
            color: theme.palette.text.secondary,
            fontWeight: "bold",
            ml: 4,
          }}
        >
          Comment
        </Button>
      </Stack>
    </Card>
  );
};

export default ConnectionPost;
