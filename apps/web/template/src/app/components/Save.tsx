// Component file: saving others' post for later reading

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
import { MoreHoriz, Bookmark } from "@mui/icons-material";
import { usePostStore, PostType } from "../stores/usePostStore";
import SavePostPopup from "./SavePostPopup";
import UnsavePopup from "./UnsavePopup";

const Save: React.FC<{ post: PostType }> = ({ post }) => {
    const theme = useTheme();
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);  
    const {
        savedPosts,
        toggleSavePost,
        setSavedPopupOpen,
        setUnsavedPopupOpen,
      } = usePostStore();

    return(
    <>
    <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
        <MoreHoriz />
    </IconButton>
    <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
    >
        {savedPosts.includes(post.id) ? (
        <MenuItem
            onClick={() => {
            toggleSavePost(post.id);
            setUnsavedPopupOpen(true);
            setMenuAnchorEl(null);
            }}
        >
            <Bookmark sx={{ fontSize: 18, mr: 1 }} />
            <Box>
            <Typography fontWeight="bold">Unsave</Typography>
            <Typography fontSize="0.75rem" color="gray">
                Unsave from your saved list
            </Typography>
            </Box>
        </MenuItem>
        ) : (
        <MenuItem
            onClick={() => {
            toggleSavePost(post.id);
            setSavedPopupOpen(true);
            setMenuAnchorEl(null);
            }}
        >
            <Bookmark sx={{ fontSize: 18, mr: 1 }} />
            Save
        </MenuItem>
        )}
    </Menu>
    <SavePostPopup />
    <UnsavePopup />
    </>
    );
  }
  
  export default Save;