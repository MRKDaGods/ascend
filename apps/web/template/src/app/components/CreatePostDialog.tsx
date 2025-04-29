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
import { useProfileStore } from "../stores/useProfileStore";

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
  const [currentIndex, setCurrentIndex] = useState(0);

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
    taggedUsers,
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

  const userData = useProfileStore((state) => state.userData) as {
    profile_picture_url?: string;
    first_name: string;
    last_name: string;
  } | null;

  const profilePicture = userData?.profile_picture_url || "/default-avatar.png";
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

    let postId: number | null = null;

    if (repostSourcePost) {
      await repostFromAPI(repostSourcePost.id, postText.trim());
      setRepostPopupOpen(true);
    } else {
      await createPostFromAPI(
        postText,
        mediaFiles,
        mediaType ?? undefined,          // ✅ image or video from useMediaStore
        "Uploaded Media",                // ✅ required title
        mediaType ? `${mediaType} file` : "No description" // ✅ fallback
      );
      
      postId = usePostStore.getState().lastUserPostId;
    }

    // 👉 Tag users if there are mentions
    if (postId && taggedUsers.length > 0 && postText.includes("@")) {
      const tagsToSend = taggedUsers.map((tag) => {
        const atIndex = postText.indexOf(`@${tag.name}`);
        return {
          userId: tag.id,
          startIndex: atIndex,
          endIndex: atIndex + tag.name.length,
        };
      }).filter(tag => tag.startIndex !== -1);

      if (tagsToSend.length > 0) {
        await usePostStore.getState().tagUsersOnContent("post", postId, tagsToSend);
      }
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
              <Avatar src={profilePicture}>{fullName.charAt(0)}</Avatar>
              <Box>
                <Typography fontWeight={600}>{fullName}</Typography>
                <Typography fontSize="0.8rem" color="text.secondary">
                  Post to Connections only
                </Typography>
              </Box>
            </Stack>
            <IconButton id="close-create-post-dialog-button" onClick={handleClose}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ mt: 2, minHeight: 100 }}>
            <TagInput postId={lastUserPostId ?? -1} placeholder="What do you want to talk about?" />
          </Box>

          {mediaPreviews.length > 0 && !documentPreview && (
  <Box sx={{ position: "relative", mt: 2 }}>
    {mediaFiles[currentIndex]?.type.startsWith("video") ? (
      <video
        src={mediaPreviews[currentIndex]}
        controls
        style={{ width: "100%", borderRadius: 10, maxHeight: 800 }}
      />
    ) : (
      <img
        src={mediaPreviews[currentIndex]}
        alt={`preview-${currentIndex}`}
        style={{ width: "100%", borderRadius: 10, maxHeight: 800 }}
      />
    )}

    {/* Left Arrow */}
    {currentIndex > 0 && (
      <Box
        onClick={() => setCurrentIndex((prev) => prev - 1)}
        sx={{
          position: "absolute",
          top: "50%",
          left: 8,
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        {"<"}
      </Box>
    )}

    {/* Right Arrow */}
    {currentIndex < mediaPreviews.length - 1 && (
      <Box
        onClick={() => setCurrentIndex((prev) => prev + 1)}
        sx={{
          position: "absolute",
          top: "50%",
          right: 8,
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        {">"}
      </Box>
    )}

    {/* Edit/Delete Controls */}
    <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
      <IconButton
        id="edit-media-preview-button"
        sx={{ bgcolor: theme.palette.background.paper }}
        onClick={() => openEditor(mediaFiles[currentIndex].type.startsWith("video") ? "video" : "image")}
      >
        <Edit />
      </IconButton>
      <IconButton
        id="delete-media-preview-button"
        sx={{ bgcolor: theme.palette.background.paper }}
        onClick={() => {
          removeMediaFile(currentIndex);
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }}
      >
        <Delete />
      </IconButton>
    </Box>
  </Box>
)}


          {/* {documentPreview && (
            <DocumentPreview fileUrl={documentPreview.url} title={documentPreview.title} onRemove={clearDocumentPreview} />
          )}

          {repostSourcePost && (
            <Box sx={{ mt: 2 }}>
              <RepostPreview post={repostSourcePost} />
            </Box>
          )} */}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Add a photo">
              <IconButton id="add-photo-button" onClick={() => openEditor("image")}>
                <Image />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add a video">
              <IconButton id="add-video-button" onClick={() => openEditor("video")}>
                <OndemandVideo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add a document">
              <IconButton id="add-document-button" onClick={() => setDocDialogOpen(true)}>
                <Article />
              </IconButton>
            </Tooltip>
          </Stack>

          <Button
            id="submit-post-button"
            variant="contained"
            onClick={handleSubmit}
            disabled={!postText.trim() && mediaFiles.length === 0 && !documentPreview}
            sx={{ textTransform: "none", px: 4 }}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>

      <DiscardPostDialog open={discardPostDialogOpen} onClose={closeDiscardPostDialog} onDiscard={() => {
        closeDiscardPostDialog();
        resetPost();
        clearAllMedia();
        clearDocumentPreview();
      }} onSave={() => {
        setDraftText(postText);
        setDraftSavedPopupOpen(true);
        closeDiscardPostDialog();
        resetPost();
        clearAllMedia();
        clearDocumentPreview();
      }} />

      <DiscardRepostDialog open={discardRepostDialogOpen} onClose={closeDiscardRepostDialog} onDiscard={() => {
        closeDiscardRepostDialog();
        resetPost();
        clearAllMedia();
        clearDocumentPreview();
        setRepostSourcePost(null);
      }} onSave={() => {
        setDraftText(postText);
        setDraftSavedPopupOpen(true);
        closeDiscardRepostDialog();
        resetPost();
        clearAllMedia();
        clearDocumentPreview();
        setRepostSourcePost(null);
      }} />

      <DraftSavedPopup />
      <RepostPopup />
      <Document open={docDialogOpen} onClose={() => setDocDialogOpen(false)} />
    </>
  );
};

export default CreatePostDialog;
