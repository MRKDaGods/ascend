"use client";

import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { Close, Edit, Delete } from "@mui/icons-material";
import { usePostStore } from "../stores/usePostStore";
import { useMediaStore } from "../stores/useMediaStore";
import TagInput from "./TagInput";

const EditPost: React.FC = () => {
  const {
    open,
    postText,
    setPostText,
    resetPost,
    editPost,
    editingPost,
    posts,
    lastUserPostId,
  } = usePostStore();

  const {
    mediaPreviews,
    removeMediaFile,
    clearAllMedia,
    openEditor,
  } = useMediaStore();

  const currentPostId = editingPost?.id ?? lastUserPostId ?? -1;

  useEffect(() => {
    if (open && editingPost) {
      setPostText(editingPost.content);
    }
  }, [open, editingPost, setPostText]);

  const handleSave = () => {
    if (!postText.trim()) return;

    const media = mediaPreviews[0];
    const type = media?.includes("video") ? "video" : "image";

    editPost(currentPostId, postText, media, type);
    resetPost();
    clearAllMedia();
  };

  const handleClose = () => resetPost();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src="/man.jpg" />
            <Box>
              <Typography fontWeight="bold">Ascend Developer</Typography>
              <Typography fontSize="0.8rem">To Connections only</Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleClose}><Close /></IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <TagInput postId={currentPostId} />
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
        <Button variant="contained" onClick={handleSave} disabled={!postText.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPost;
