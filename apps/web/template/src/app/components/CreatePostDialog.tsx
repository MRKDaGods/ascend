"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Stack, Typography, Tooltip, Popper, TextField
} from "@mui/material";
import {
  Close, Edit, Delete, Image, OndemandVideo, Article
} from "@mui/icons-material";
// import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ClickAwayListener from "@mui/material/ClickAwayListener"; // ✅ Add this import at the top
import RepostPreview from "./RepostPreview";

import { usePostStore } from "../stores/usePostStore";
import { useMediaStore } from "../stores/useMediaStore";

import TagInput from "./TagInput";
import DiscardPostDialog from "./DiscardPostDialog";
import DiscardRepostDialog from "./DiscardRepostDialog";
import DraftSavedPopup from "./DraftSavedPopup";
import Document from "./Document";
import DocumentPreview from "./DocumentPreview";
import RepostPopup from "./RepostPopup";

// import Picker from "@emoji-mart/react";
// import data from "@emoji-mart/data";
// import Picker from "@emoji-mart/react";
// import data from "@emoji-mart/data";

const CreatePostDialog: React.FC = () => {
  const {
    open,
    postText,
    setPostText,
    resetPost,
    draftText,
    discardPostDialogOpen,
    discardRepostDialogOpen,
    closeDiscardPostDialog,
    closeDiscardRepostDialog,
    openDiscardPostDialog,
    openDiscardRepostDialog,
    setDraftSavedPopupOpen,
    setDraftText,
    lastUserPostId,
    addPost,
    repostSourcePost, 
    setRepostSourcePost,
  } = usePostStore();


  const {
    mediaPreviews,
    removeMediaFile,
    clearAllMedia,
    openEditor,
    documentPreview,
    clearDocumentPreview,
  } = useMediaStore();

  // const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // const emojiAnchorRef = useRef<HTMLButtonElement | null>(null);
  // const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // const emojiAnchorRef = useRef<HTMLButtonElement | null>(null);
  const [docDialogOpen, setDocDialogOpen] = useState(false);

  useEffect(() => {
    if (open && draftText) {
      setPostText(draftText);
    }
  }, [open, draftText]);

  const handleSubmit = async () => {
    if (!postText.trim() && mediaPreviews.length === 0 && !documentPreview) return;
  
    const media = mediaPreviews[0];
    const type = media?.includes("video") ? "video" : "image";
  
    addPost(postText, media, type, documentPreview ?? undefined, repostSourcePost);

    // Reset everything after posting
    setDraftText("");
    setPostText("");
    resetPost();
    clearAllMedia();
    clearDocumentPreview();
    setRepostSourcePost(null); // <-- this is the missing part
  };
  

  const handleClose = () => {
    const hasUnsavedContent =
      postText.length > 0 ||
      mediaPreviews.length > 0 ||
      documentPreview ||
      repostSourcePost;
  
    if (hasUnsavedContent) {
      if (repostSourcePost) {
        openDiscardRepostDialog();
      } else {
        openDiscardPostDialog();
      }
    } else {
      resetPost();
      setRepostSourcePost(null);
      clearAllMedia();
      clearDocumentPreview();
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

          {documentPreview && (
            <DocumentPreview
              fileUrl={documentPreview.url}
              title={documentPreview.title}
              onRemove={clearDocumentPreview}
            />
          )}
          
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          {/* ✅ Only show this if user clicked "Repost with your thoughts" */}
          {repostSourcePost && <RepostPreview post={repostSourcePost} />}
        </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Add a photo"><IconButton onClick={openEditor}><Image /></IconButton></Tooltip>
            <Tooltip title="Add a video"><IconButton onClick={openEditor}><OndemandVideo /></IconButton></Tooltip>
            <Tooltip title="Add a document"><IconButton onClick={() => setDocDialogOpen(true)}><Article /></IconButton></Tooltip>
            {/* <Tooltip title="Add an emoji">
            {/* <Tooltip title="Add an emoji">
              <IconButton
                ref={emojiAnchorRef}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <EmojiEmotionsIcon />
              </IconButton>
            </Tooltip> */}
          </Stack>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!postText.trim() && mediaPreviews.length === 0 && !documentPreview}
            sx={{ textTransform: "none", px: 4 }}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* Emoji Picker */}
      {/* <Popper
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
                setPostText((prev: string) => prev + emoji.native);
                setShowEmojiPicker(false);
              }}
              previewPosition="none"
              theme="light"
              perLine={9}
            />
          </Box>
        </ClickAwayListener>
      </Popper> */}

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

      <DiscardRepostDialog
        open={discardRepostDialogOpen}
        onClose={closeDiscardRepostDialog}
        onDiscard={() => {
          closeDiscardRepostDialog();
          resetPost();
          clearAllMedia();
          clearDocumentPreview();
          setRepostSourcePost(null);
        }}
        onSave={() => {
          setDraftText(postText);
          setDraftSavedPopupOpen(true);
          closeDiscardRepostDialog();
          resetPost();
          clearAllMedia();
          clearDocumentPreview();
        }}
      />

      <DraftSavedPopup />
      <RepostPopup />

      <Document open={docDialogOpen} onClose={() => setDocDialogOpen(false)} />
    </>
  );
};

export default CreatePostDialog;