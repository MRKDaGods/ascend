"use client";

import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { MoreHoriz, Bookmark, Link as LinkIcon } from "@mui/icons-material";
import { usePostStore, PostType } from "../stores/usePostStore";
import SavePostPopup from "./SavePostPopup";
import UnsavePopup from "./UnsavePopup";
import CopyPostPopup from "./CopyPostPopup";

const SaveandLink: React.FC<{ post: PostType }> = ({ post }) => {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const {
    savedPosts,
    toggleSavePostAPI,
    setCopyPostPopupOpen,
  } = usePostStore();

  const isSaved = savedPosts.includes(post.id);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/copypost?id=${post.id}`;
    navigator.clipboard.writeText(link);
    setCopyPostPopupOpen(true);
    setMenuAnchorEl(null);
  };

  const handleToggleSave = async () => {
    await toggleSavePostAPI(post.id);
    setMenuAnchorEl(null); // Close menu after action
  };

  return (
    <>
      <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
        <MoreHoriz />
      </IconButton>

      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem
          onClick={async () => {
            await toggleSavePostAPI(post.id);
            setMenuAnchorEl(null);
          }}
        >
          <Bookmark sx={{ fontSize: 18, mr: 1 }} />
          {savedPosts.includes(post.id) ? (
            <Box>
              <Typography fontWeight="bold">Unsave</Typography>
              <Typography fontSize="0.75rem" color="gray">
                Unsave from your saved list
              </Typography>
            </Box>
          ) : (
            <Typography fontWeight="bold">Save</Typography>
          )}
        </MenuItem>

        <MenuItem onClick={handleCopyLink}>
          <LinkIcon sx={{ fontSize: 18, mr: 1 }} />
          Copy link to post
        </MenuItem>
      </Menu>

      <SavePostPopup />
      <UnsavePopup />
      <CopyPostPopup />
    </>
  );
};

export default SaveandLink;
