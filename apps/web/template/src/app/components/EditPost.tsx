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
  Typography,
  useTheme,
} from "@mui/material";
import { Close, Edit, Delete } from "@mui/icons-material";
import { usePostStore } from "../stores/usePostStore";
import { useMediaStore } from "../stores/useMediaStore";
import TagInput from "./TagInput";

const EditPost: React.FC = () => {
  const theme = useTheme();

  const {
    open,
    postText,
    setPostText,
    resetPost,
    editPostFromAPI,
    editingPost,
    lastUserPostId,
  } = usePostStore();

  const {
    mediaPreviews,
    mediaType,
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
    editPostFromAPI(currentPostId, postText.trim());
    resetPost();
    clearAllMedia();
  };

  const handleClose = () => {
    resetPost();
    clearAllMedia();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src="/man.jpg" />
            <Box>
              <Typography fontWeight="bold">Ascend Developer</Typography>
              <Typography fontSize="0.8rem" color={theme.palette.text.secondary}>
                To Connections only
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleClose} sx={{ color: theme.palette.text.primary }}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: theme.palette.background.paper }}>
        <TagInput postId={currentPostId} />

        {mediaPreviews.length > 0 && (
          <Box sx={{ position: "relative", mt: 2 }}>
            {mediaType === "video" ? (
              <video
                src={mediaPreviews[0]}
                controls
                style={{
                  width: "100%",
                  borderRadius: 10,
                  maxHeight: 400,
                  objectFit: "cover",
                  backgroundColor: theme.palette.background.default,
                }}
              />
            ) : (
              <img
                src={mediaPreviews[0]}
                alt="Media Preview"
                style={{
                  width: "100%",
                  borderRadius: 10,
                  objectFit: "cover",
                  maxHeight: 400,
                }}
              />
            )}

            <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
              <IconButton
                sx={{ bgcolor: theme.palette.action.hover, color: theme.palette.text.primary }}
                onClick={() => openEditor(mediaType ?? "image")}
              >
                <Edit />
              </IconButton>
              <IconButton
                sx={{ bgcolor: theme.palette.action.hover, color: theme.palette.text.primary }}
                onClick={() => removeMediaFile(0)}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ backgroundColor: theme.palette.background.paper, px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!postText.trim()}
          sx={{ textTransform: "none" }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPost;
