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
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";

import { useCompanyPostStore } from "../stores/useCompanyPostStore";
import { useMediaStore } from "../stores/useMediaStore";

import TagInputCompany from "./TagInputCompany";
import DiscardCompanyPostDialog from "./DiscardCompanyPostDialog";
import DiscardRepostCompanyDialog from "./DiscardRepostCompanyDialog";
import CompanyDraftSavedPopup from "./CompanyDraftSavedPopup";
import Document from "./Document";
import DocumentPreview from "./DocumentPreview";
import CompanyRepostPreview from "./CompanyRepostPreview";
import RepostCompanyPopup from "./RepostCompanyPopup";

const CreateCompanyPostDialog: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const [docDialogOpen, setDocDialogOpen] = useState(false);

  const {
    open,
    postText,
    setPostText,
    resetPost,
    draftText,
    discardCompanyPostDialogOpen,
    discardCompanyRepostDialogOpen,
    closeDiscardCompanyPostDialog,
    closeDiscardCompanyRepostDialog,
    openDiscardCompanyPostDialog,
    openDiscardCompanyRepostDialog,
    setCompanyDraftSavedPopupOpen,
    setDraftText,
    lastCompanyPostId,
    repostSourcePost,
    setRepostSourcePost,
    // createCompanyPostDummy,
    setRepostPopupOpen,
    // repostDummy,
  } = useCompanyPostStore();

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

    // if (repostSourcePost) {
    //   await repostFromAPI(repostSourcePost.id, postText.trim());
    //   setRepostPopupOpen(true);
    // } else {
    //   await createCompanyPostDummy(
    //     postText,
    //     fileToSend,
    //     typeToSend,
    //     documentPreview?.title,
    //     "Uploaded from CreatePostDialog"
    //   );
    // }

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
      repostSourcePost ? openDiscardCompanyRepostDialog() : openDiscardCompanyRepostDialog();
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
              <Avatar src={"man.jpg"}>
              </Avatar>
              <Box>
                <Typography fontWeight={600}>Company User Name</Typography>
              </Box>
            </Stack>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ mt: 2, minHeight: 100 }}>
            <TagInputCompany postId={lastCompanyPostId ?? -1} />
          </Box>

          {mediaPreviews[0] && !documentPreview && (
            <Box sx={{ position: "relative", mt: 2 }}>
              {mediaType === "video" ? (
                <video
                  src={mediaPreviews[0]}
                  controls
                  style={{ width: "100%", borderRadius: 10, maxHeight: 800 }}
                />
              ) : (
                <img
                  src={mediaPreviews[0]}
                  alt="preview"
                  style={{ width: "100%", borderRadius: 10, maxHeight: 800 }}
                />
              )}
              <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                <IconButton
                  sx={{ bgcolor: theme.palette.background.paper }}
                  onClick={() => openEditor(mediaType ?? "image")}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  sx={{ bgcolor: theme.palette.background.paper }}
                  onClick={() => removeMediaFile(0)}
                >
                  <Delete />
                </IconButton>
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
              <CompanyRepostPreview post={repostSourcePost} />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Add a photo">
              <IconButton onClick={() => openEditor("image")}>
                <Image />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add a video">
              <IconButton onClick={() => openEditor("video")}>
                <OndemandVideo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add a document">
              <IconButton onClick={() => setDocDialogOpen(true)}>
                <Article />
              </IconButton>
            </Tooltip>
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

      {/* Popups */}
      <DiscardCompanyPostDialog
        open={discardCompanyPostDialogOpen}
        onClose={closeDiscardCompanyPostDialog}
        onDiscard={() => {
          closeDiscardCompanyPostDialog();
          resetPost();
          clearAllMedia();
          clearDocumentPreview();
        }}
        onSave={() => {
          setDraftText(postText);
          setCompanyDraftSavedPopupOpen(true);
          closeDiscardCompanyPostDialog();
          resetPost();
          clearAllMedia();
          clearDocumentPreview();
        }}
      />

      <DiscardRepostCompanyDialog
        open={discardCompanyRepostDialogOpen}
        onClose={closeDiscardCompanyRepostDialog}
        onDiscard={() => {
          closeDiscardCompanyRepostDialog();
          resetPost();
          clearAllMedia();
          clearDocumentPreview();
          setRepostSourcePost(null);
        }}
        onSave={() => {
          setDraftText(postText);
          setCompanyDraftSavedPopupOpen(true);
          closeDiscardCompanyRepostDialog();
          resetPost();
          clearAllMedia();
          clearDocumentPreview();
          setRepostSourcePost(null);
        }}
      />

      <CompanyDraftSavedPopup />
      <RepostCompanyPopup />
      <Document open={docDialogOpen} onClose={() => setDocDialogOpen(false)} />
    </>
  );
};

export default CreateCompanyPostDialog;
