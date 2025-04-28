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

import { usePostStore } from "../stores/usePostStore";
import { useMediaStore } from "../stores/useMediaStore";
import { useProfileStore } from "../stores/useProfileStore"; // ✅ import profile store

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
  const theme = useTheme();
  const [docDialogOpen, setDocDialogOpen] = useState(false);

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

  type Profile = {
    profile_picture_url?: string;
    first_name: string;
    last_name: string;
  };  
  
  const userData = useProfileStore((state) => state.userData) as Profile | null;
  const profilePicture = userData?.profile_picture_url || "/default-avatar.png"; //❌ Fallback
  const fullName = userData ? `${userData.first_name} ${userData.last_name}` : "User";

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
              <Avatar src={profilePicture}>
                {fullName.charAt(0)}
              </Avatar>
              <Box>
                <Typography fontWeight={600}>{fullName}</Typography>
                <Typography fontSize="0.8rem" color="text.secondary">
                  Post to Connections only
                </Typography>
              </Box>
            </Stack>
            <IconButton
              id="close-create-post-dialog-button" // ✅ ID added
              onClick={handleClose}
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ mt: 2, minHeight: 100 }}>
            <TagInput postId={lastUserPostId ?? -1} />
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
                  id="edit-media-preview-button" // ✅ ID added
                  sx={{ bgcolor: theme.palette.background.paper }}
                  onClick={() => openEditor(mediaType ?? "image")}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  id="delete-media-preview-button" // ✅ ID added
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
              <RepostPreview post={repostSourcePost} />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Add a photo">
              <IconButton
                id="add-photo-button" // ✅ ID added
                onClick={() => openEditor("image")}
              >
                <Image />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add a video">
              <IconButton
                id="add-video-button" // ✅ ID added
                onClick={() => openEditor("video")}
              >
                <OndemandVideo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add a document">
              <IconButton
                id="add-document-button" // ✅ ID added
                onClick={() => setDocDialogOpen(true)}
              >
                <Article />
              </IconButton>
            </Tooltip>
          </Stack>

          <Button
            id="submit-post-button" // ✅ ID added
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
