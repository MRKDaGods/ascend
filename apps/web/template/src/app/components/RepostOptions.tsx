"use client";

import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { Repeat, Edit } from "@mui/icons-material";
import { usePostStore, PostType } from "../stores/usePostStore";

const RepostOptions: React.FC<{ post: PostType }> = ({ post }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    repostFromAPI, // ✅ new name
    setRepostSourcePost,
    setOpen,
  } = usePostStore();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRepost = async () => {
    await repostFromAPI(post.id, ""); // no comment = instant repost
    handleClose();
  };

  const handleRepostWithThoughts = () => {
    setRepostSourcePost(post); // opens CreatePostDialog with preview
    setOpen(true);
    handleClose();
  };

  return (
    <>
      <Button
        startIcon={<Repeat />}
        onClick={handleClick}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          color: theme.palette.text.secondary,
        }}
      >
        Repost
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleRepostWithThoughts}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          <Box>
            <Typography fontWeight="bold">Repost with your thoughts</Typography>
            <Typography variant="caption">
              Create a new post with the original attached
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleRepost}>
          <Repeat fontSize="small" sx={{ mr: 1 }} />
          <Box>
            <Typography fontWeight="bold">Repost</Typography>
            <Typography variant="caption">
              Instantly bring this post to your followers
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default RepostOptions;
