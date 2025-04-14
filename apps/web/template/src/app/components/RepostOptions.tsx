"use client";

import React, { useState } from "react";
import { Button, Menu, MenuItem, Typography, Box, useTheme } from "@mui/material";
import { Repeat, Edit } from "@mui/icons-material";
import { usePostStore } from "../stores/usePostStore";

const RepostOptions: React.FC<{ postId: number }> = ({ postId }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { repostPost } = usePostStore();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRepost = () => {
    repostPost(postId);
    handleClose();
  };

  const handleRepostWithThoughts = () => {
    // set repost popup true and store original post (expand later)
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
