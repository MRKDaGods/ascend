"use client";

import React, { useEffect } from "react";
import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Stack, Typography
} from "@mui/material";
import { Close, Edit, Delete } from "@mui/icons-material";
import { usePostStore } from "../stores/usePostStore";
import { useMediaStore } from "../stores/useMediaStore";
import DiscardPostDialog from "./DiscardPostDialog";
import DraftSavedPopup from "./DraftSavedPopup";
import TagInput from "./TagInput";

const CreatePostDialog: React.FC = () => {
  const {
    open,
    postText,
    setPostText,
    resetPost,
    draftText,
    setUserPostPopupOpen,
    discardPostDialogOpen,
    closeDiscardPostDialog,
    openDiscardPostDialog,
    setDraftSavedPopupOpen,
    setDraftText,
    lastUserPostId,
    createPostViaAPI,
  } = usePostStore();

  const {
    mediaPreviews, removeMediaFile, clearAllMedia, openEditor,
  } = useMediaStore();

  useEffect(() => {
    if (open && draftText) {
      setPostText(draftText);
    }
  }, [open, draftText]);

  const handleSubmit = async () => {
    if (!postText.trim() && mediaPreviews.length === 0) return;

    const media = mediaPreviews[0];
    const type = media?.includes("video") ? "video" : "image";

    await createPostViaAPI(postText, media, type);
    setUserPostPopupOpen(true);
    setDraftText("");

    resetPost();
    clearAllMedia();
  };

  const handleClose = () => {
    if (postText.length > 0) openDiscardPostDialog();
    else resetPost();
  };

  return (
    <>
      <Dialog open fullWidth maxWidth="md" onClose={handleClose}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src="/man.jpg" />
              <Box>
                <Typography fontWeight="bold">Developing Ascend</Typography>
                <Typography fontSize="0.8rem">Post to Connections only</Typography>
              </Box>
            </Stack>
            <IconButton onClick={handleClose}><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ mt: 0 }}>
          <TagInput postId={lastUserPostId ?? -1} />

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
            Post
          </Button>
        </DialogActions>
      </Dialog>

      <DiscardPostDialog
        open={discardPostDialogOpen}
        onClose={closeDiscardPostDialog}
        onDiscard={() => {
          closeDiscardPostDialog();
          resetPost();
        }}
        onSave={() => {
          setDraftText(postText);
          setDraftSavedPopupOpen(true);
          closeDiscardPostDialog();
          resetPost();
        }}
      />
      <DraftSavedPopup />
    </>
  );
};

export default CreatePostDialog;
