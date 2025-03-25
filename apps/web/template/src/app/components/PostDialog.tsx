"use client";

import React from "react";
import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Stack, TextField, Typography
} from "@mui/material";
import { Close, Edit, Delete } from "@mui/icons-material";
import { usePostStore } from "../store/usePostStore";
import { useMediaStore } from "../store/useMediaStore";

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


    const handlePost = () => {
      if (!postText.trim()) return;

      let mediaUrl = mediaPreviews[0]; // Assume one file for now
      const isImage = mediaFiles[0]?.type?.startsWith("image");
      const isVideo = mediaFiles[0]?.type?.startsWith("video");

      if (mediaUrl) {
        addPost(postText, mediaUrl, isImage ? "image" : isVideo ? "video" : undefined);
      } else {
        addPost(postText);
      }

      clearAllMedia(); // ✅ Clean up
      setPopupOpen(true);
      resetPost(); // Close the post dialog
    };


  // const handlePost = () => {
  //   if (postText.trim()) {
  //     const media = mediaPreviews[0];
  //     const mediaType = mediaFiles[0]?.type.startsWith("video") ? "video" : "image";
  //     addPost(postText, media, mediaType);
  //     setPopupOpen(true);
  //     resetPost();
  //     clearAllMedia(); // Clean media after post
  //   }
  // };

  const handleSubmit = () => {
    if (!postText.trim()) return;
  
    if (editingPost) {
      editPost(editingPost.id, postText);
    } else {
      addPost(postText);
    }
  
    resetPost(); // Clears everything
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
        <Button variant="contained" onClick={handleSubmit} disabled={!postText.trim() && mediaPreviews.length === 0}>
          {editingPost ? "Save" : "Post"}
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default PostDialog;
