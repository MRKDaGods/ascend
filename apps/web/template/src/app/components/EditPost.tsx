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
import { useProfileStore } from "../stores/useProfileStore";

import TagInput from "./TagInput";
import DocumentPreview from "./DocumentPreview";

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
    documentPreview,
    clearDocumentPreview,
  } = useMediaStore();

  const userData = useProfileStore((state) => state.userData) as {
    profile_picture_url?: string;
    first_name: string;
    last_name: string;
  } | null;

  const profilePicture = userData?.profile_picture_url || "/default-avatar.png";
  const fullName = userData
    ? `${userData.first_name} ${userData.last_name}`
    : "User";

  const currentPostId = editingPost?.id ?? lastUserPostId ?? -1;

  useEffect(() => {
    if (open && editingPost) {
      setPostText(editingPost.content);

      // Clear media if document is set (avoid stale previews from previous posts)
      if (editingPost.type === "document") {
        clearAllMedia();
      } else {
        clearDocumentPreview();
      }
    }
  }, [open, editingPost, setPostText, clearAllMedia, clearDocumentPreview]);

  const handleSave = () => {
    if (!postText.trim()) return;
    editPostFromAPI(currentPostId, postText.trim());
    resetPost();
    clearAllMedia();
    clearDocumentPreview();
  };

  const handleClose = () => {
    resetPost();
    clearAllMedia();
    clearDocumentPreview();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={profilePicture}>{fullName.charAt(0)}</Avatar>
            <Box>
              <Typography fontWeight="bold">{fullName}</Typography>
              <Typography
                fontSize="0.8rem"
                color={theme.palette.text.secondary}
              >
                To Connections only
              </Typography>
            </Box>
          </Stack>
          <IconButton
            id="close-edit-post-dialog-button"
            onClick={handleClose}
            sx={{ color: theme.palette.text.primary }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: theme.palette.background.paper }}>
        <TagInput postId={currentPostId} />

        {/* Show Document if available */}
        {documentPreview ? (
          <DocumentPreview
            fileUrl={documentPreview.url}
            title={documentPreview.title}
            onRemove={clearDocumentPreview}
          />
        ) : mediaPreviews.length > 0 ? (
          <Box sx={{ position: "relative", mt: 2 }}>
            {mediaType === "video" ? (
              <video
                src={mediaPreviews[0]}
                controls
                style={{
                  width: "100%",
                  borderRadius: 10,
                  maxHeight: 700,
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

            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton
                id="edit-media-button"
                sx={{
                  bgcolor: theme.palette.action.hover,
                  color: theme.palette.text.primary,
                }}
                onClick={() => openEditor(mediaType ?? "image")}
              >
                <Edit />
              </IconButton>
              <IconButton
                id="delete-media-button"
                sx={{
                  bgcolor: theme.palette.action.hover,
                  color: theme.palette.text.primary,
                }}
                onClick={() => removeMediaFile(0)}
              >
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions
        sx={{ backgroundColor: theme.palette.background.paper, px: 3, pb: 2 }}
      >
        <Button
          id="save-post-button"
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
