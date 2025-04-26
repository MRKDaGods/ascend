"use client";

import React, { useEffect, useState } from "react";
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
  Tooltip,
} from "@mui/material";
import { Close, Edit, Delete, Image, OndemandVideo, Article } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { usePostStore } from "../stores/usePostStore";
import { useMediaStore } from "../stores/useMediaStore";
import { useTheme } from "@mui/material/styles";

import TagInput from "./TagInput";
import DiscardPostDialog from "./DiscardPostDialog";
import DiscardRepostDialog from "./DiscardRepostDialog";
import DraftSavedPopup from "./DraftSavedPopup";
import Document from "./Document";
import DocumentPreview from "./DocumentPreview";
import RepostPreview from "./RepostPreview";
import RepostPopup from "./RepostPopup";

const CreatePostDialog: React.FC = () => {
  const router = useRouter();
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const theme = useTheme();
  
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
    repostSourcePost,
    setRepostSourcePost,
    createPostFromAPI,
    setRepostPopupOpen,
    repostFromAPI,
  } = usePostStore();

  const {
    mediaPreviews,
    mediaFiles,
    mediaType,
    removeMediaFile,
    clearAllMedia,
    openEditor,
    documentPreview,
    documentFile,
    clearDocumentPreview,
  } = useMediaStore();

  useEffect(() => {
    if (open && draftText) {
      setPostText(draftText);
    }
  }, [open, draftText]);

  const handleSubmit = async () => {
    if (!postText.trim() && mediaFiles.length === 0 && !documentPreview) return;

    const fileToSend = documentPreview ? documentFile : mediaFiles[0];
    const typeToSend = documentPreview ? "file" : mediaType ?? undefined;

    if (repostSourcePost) {
      await repostFromAPI(repostSourcePost.id, postText.trim());
      setRepostPopupOpen(true);
    } else {
      await createPostFromAPI(
        postText,
        fileToSend,
        typeToSend,
        documentPreview?.title,
        "Uploaded from CreatePostDialog"
      );
    }

    // Cleanup
    setDraftText("");
    setPostText("");
    resetPost();
    clearAllMedia();
    clearDocumentPreview();
    setRepostSourcePost(null);
  };

  const handleClose = () => {
    const hasUnsaved =
      !!postText.trim() || mediaFiles.length > 0 || !!documentPreview || !!repostSourcePost;

    if (hasUnsaved) {
      repostSourcePost ? openDiscardRepostDialog() : openDiscardPostDialog();
    } else {
      resetPost();
      clearAllMedia();
      clearDocumentPreview();
      setRepostSourcePost(null);
    }
  };

  return (
    <>
      <Dialog open={open} fullWidth maxWidth="sm" onClose={handleClose}>
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
          <Box sx={{ mt: 2, minHeight: 100 }}>
            <TagInput postId={lastUserPostId ?? -1} />
          </Box>

          {mediaPreviews[0] && !documentPreview && (
            <Box sx={{ position: "relative", mt: 2 }}>
              {mediaType === "video" ? (
                <video src={mediaPreviews[0]} controls style={{ width: "100%", borderRadius: 10, maxHeight: 800 }} />
              ) : (
                <img src={mediaPreviews[0]} alt="preview" style={{ width: "100%", borderRadius: 10, maxHeight: 800 }} />
              )}
              <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                <IconButton sx={{ bgcolor: theme.palette.background.paper }} onClick={() => openEditor(mediaType ?? "image")}><Edit /></IconButton>
                <IconButton sx={{ bgcolor: theme.palette.background.paper }} onClick={() => removeMediaFile(0)}><Delete /></IconButton>
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

          {repostSourcePost && (
            <Box sx={{ mt: 2 }}>
              <RepostPreview post={repostSourcePost} />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Add a photo"><IconButton onClick={() => openEditor("image")}><Image /></IconButton></Tooltip>
            <Tooltip title="Add a video"><IconButton onClick={() => openEditor("video")}><OndemandVideo /></IconButton></Tooltip>
            <Tooltip title="Add a document"><IconButton onClick={() => setDocDialogOpen(true)}><Article /></IconButton></Tooltip>
          </Stack>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!postText.trim() && mediaFiles.length === 0 && !documentPreview}
            sx={{ textTransform: "none", px: 4 }}
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
          setRepostSourcePost(null);
        }}
      />

      <DraftSavedPopup />
      <RepostPopup />
      <Document open={docDialogOpen} onClose={() => setDocDialogOpen(false)} />
    </>
  );
};

export default CreatePostDialog;
