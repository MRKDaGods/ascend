"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Stack, Typography, Tooltip, Popper
} from "@mui/material";
import {
  Close, Edit, Delete, Image, OndemandVideo, Article
} from "@mui/icons-material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ClickAwayListener from "@mui/material/ClickAwayListener"; // ✅ Add this import at the top

import { usePostStore } from "../stores/usePostStore";
import { useMediaStore } from "../stores/useMediaStore";

import TagInput from "./TagInput";
import DiscardPostDialog from "./DiscardPostDialog";
import DraftSavedPopup from "./DraftSavedPopup";
import Document from "./Document";
import DocumentPreview from "./DocumentPreview";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

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
    addPost,
  } = usePostStore();

  const {
    mediaPreviews,
    removeMediaFile,
    clearAllMedia,
    openEditor,
    documentPreview,
    clearDocumentPreview,
  } = useMediaStore();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiAnchorRef = useRef<HTMLButtonElement | null>(null);
  const [docDialogOpen, setDocDialogOpen] = useState(false);

  useEffect(() => {
    if (open && draftText) {
      setPostText(draftText);
    }
  }, [open, draftText]);

  const handleSubmit = () => {
    if (!postText.trim() && mediaPreviews.length === 0 && !documentPreview) return;

    const media = mediaPreviews[0];
    const type = media?.includes("video") ? "video" : "image";

    // ✅ Add post to Zustand
    addPost(postText, media, type, documentPreview ?? undefined);


    // ✅ UI handling
    setUserPostPopupOpen(true);
    setDraftText("");
    resetPost();
    clearAllMedia();
    clearDocumentPreview(); // remove doc preview on post
  };

  const handleClose = () => {
    if (postText.length > 0 || mediaPreviews.length > 0 || documentPreview) {
      openDiscardPostDialog();
    } else {
      resetPost();
    }
  };

  return (
    <>
      <Dialog open fullWidth maxWidth="sm" onClose={handleClose}>
        <DialogTitle sx={{ pb: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src="/man.jpg" />
              <Box>
                <Typography fontWeight={600}>Developing Ascend</Typography>
                <Typography fontSize="0.8rem">Post to Connections only</Typography>
              </Box>
            </Stack>
            <IconButton onClick={handleClose}><Close /></IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box
            sx={{
              mt: 2,
              minHeight: "100px",
              fontSize: "1rem",
              width: "100%",
              backgroundColor: "transparent",
              '& textarea': {
                fontSize: '1rem',
                lineHeight: 1.5,
                padding: 0,
                border: "none",
                resize: "none",
                width: "100%",
                fontFamily: "inherit",
                background: "transparent",
                outline: "none",
              }
            }}
          >
            <TagInput postId={lastUserPostId ?? -1} />
          </Box>

          {/* Image/Video Preview */}
          {mediaPreviews.length > 0 && (
            <Box sx={{ position: "relative", mt: 2 }}>
              <img
                src={mediaPreviews[0]}
                alt="preview"
                style={{
                  width: "100%",
                  borderRadius: 10,
                  objectFit: "cover",
                  maxHeight: "400px",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 1,
                }}
              >
                <IconButton sx={{ bgcolor: "white" }} onClick={openEditor}><Edit /></IconButton>
                <IconButton sx={{ bgcolor: "white" }} onClick={() => removeMediaFile(0)}><Delete /></IconButton>
              </Box>
            </Box>
          )}

          {/* Document Preview */}
          {documentPreview && (
            <DocumentPreview
              fileUrl={documentPreview.url}
              title={documentPreview.title}
              onRemove={clearDocumentPreview}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Add a photo"><IconButton onClick={openEditor}><Image /></IconButton></Tooltip>
            <Tooltip title="Add a video"><IconButton onClick={openEditor}><OndemandVideo /></IconButton></Tooltip>
            <Tooltip title="Add a document"><IconButton onClick={() => setDocDialogOpen(true)}><Article /></IconButton></Tooltip>
            <Tooltip title="Add an emoji">
              <IconButton
                ref={emojiAnchorRef}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <EmojiEmotionsIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!postText.trim() && mediaPreviews.length === 0 && !documentPreview}
            sx={{
              textTransform: "none",
              px: 4,
            }}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Emoji Picker */}
      <Popper
        open={showEmojiPicker}
        anchorEl={emojiAnchorRef.current}
        placement="top-start"
        style={{ zIndex: 1600 }}
      >
        <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
          <Box sx={{ zIndex: 1600 }}>
            <Picker
              data={data}
              onEmojiSelect={(emoji: any) => {
                setPostText(postText + emoji.native);
                setShowEmojiPicker(false);
              }}
            />
          </Box>
        </ClickAwayListener>
      </Popper>

      <DiscardPostDialog
        open={discardPostDialogOpen}
        onClose={closeDiscardPostDialog}
        onDiscard={() => {
          closeDiscardPostDialog();
          resetPost();
          clearAllMedia();
          clearDocumentPreview();
        }}
        onSave={() => {
          setDraftText(postText);
          setDraftSavedPopupOpen(true);
          closeDiscardPostDialog();
          resetPost();
          clearAllMedia();
          clearDocumentPreview();
        }}
      />

      <DraftSavedPopup />
      <Document open={docDialogOpen} onClose={() => setDocDialogOpen(false)} />
    </>
  );
};

export default CreatePostDialog;
