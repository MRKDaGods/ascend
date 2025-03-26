"use client";

import React from "react";
import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Stack, TextField, Typography
} from "@mui/material";
import { Close, Edit, Delete } from "@mui/icons-material";
import { usePostStore } from "../stores/usePostStore";
import { useMediaStore } from "../stores/useMediaStore";

const PostDialog: React.FC = () => {
  const {
    open,
    postText,
    setPostText,
    resetPost,
    addPost,
    editPost,
    editingPost,
    setPopupOpen,
  } = usePostStore();
  const {
    mediaPreviews, mediaFiles, removeMediaFile, clearAllMedia, openEditor
  } = useMediaStore();

  const handleSubmit = () => {
    if (!postText.trim() && mediaPreviews.length === 0) return;
  
    const media = mediaPreviews[0];
    const type = media?.includes("video") ? "video" : "image";
  
    if (editingPost) {
      // Edit mode (text only for now)
      editPost(editingPost.id, postText);
    } else {
      // Add new post with text + optional media
      addPost(postText, media, type === "image" ? "image" : "video");
      setPopupOpen(true);
    }
  
    resetPost();
    clearAllMedia();
  };
  

  return (
    <Dialog open fullWidth maxWidth="md" onClose={resetPost}>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src="/profile.jpg" />
            <Box>
              <Typography fontWeight="bold">Developing Ascend</Typography>
              <Typography fontSize="0.8rem">Post to Connections only</Typography>
            </Box>
          </Stack>
          <IconButton onClick={resetPost}><Close /></IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth multiline rows={4}
          placeholder="What do you want to talk about?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          variant="standard"
        />

        {mediaPreviews.length > 0 && (
          <Box sx={{ position: "relative", mt: 2 }}>
            <img src={mediaPreviews[0]} alt="preview" style={{ width: "100%", borderRadius: 10 }} />
            <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
              <IconButton sx={{ bgcolor: "white" }} onClick={() => openEditor()}><Edit /></IconButton>
              <IconButton sx={{ bgcolor: "white" }} onClick={() => removeMediaFile(0)}><Delete /></IconButton>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!postText.trim() && mediaPreviews.length === 0}
        >
          {editingPost ? "Save" : "Post"}
        </Button>
    </DialogActions>

    </Dialog>
  );
};

export default PostDialog;
