import React, { useEffect, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Button
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMediaStore } from "../stores/useMediaStore";
import MediaPreview from "./MediaPreview";
import DiscardDialog from "./DiscardDialog";
import { usePostStore } from "../stores/usePostStore";

const MediaEditor: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    mediaFiles, setMediaFiles, editorOpen, closeEditor,
    discardDialogOpen, closeDiscardDialog, openDiscardDialog, clearAllMedia
  } = useMediaStore();
  const { setOpen } = usePostStore();

  useEffect(() => {
    if (editorOpen && mediaFiles.length === 0 && fileInputRef.current) {
      setTimeout(() => fileInputRef.current?.click(), 300);
    }
  }, [editorOpen, mediaFiles]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      setMediaFiles(Array.from(selected));
    }
  };

  const handleClose = () => {
    if (mediaFiles.length > 0) openDiscardDialog();
    else closeEditor();
  };

  const handleNext = () => {
    closeEditor();
    setOpen(true); // Show PostDialog
  };

  return (
    <>
      <input type="file" accept="image/*,video/*" hidden ref={fileInputRef} onChange={handleFileUpload} />

      <Dialog open={editorOpen} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Editor</Typography>
          <IconButton onClick={handleClose}><Close /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ minHeight: 300 }}>
          {mediaFiles.length > 0 ? <MediaPreview /> : (
            <Box textAlign="center" mt={5}>
              <img src="/select-files.png" width={200} />
              <Typography fontWeight="bold" mt={2}>Select files to begin</Typography>
              <Typography color="gray">Share images or a single video in your post.</Typography>
              <Button variant="contained" component="label" sx={{ mt: 2 }}>
                Upload from computer
                <input type="file" hidden onChange={handleFileUpload} />
              </Button>
            </Box>
          )}
        </DialogContent>

        {mediaFiles.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Button variant="contained" onClick={handleNext}>Next</Button>
          </Box>
        )}
      </Dialog>

      <DiscardDialog open={discardDialogOpen} onClose={closeDiscardDialog} onDiscard={() => {
        clearAllMedia();
        closeDiscardDialog();
        closeEditor();
      }} />
    </>
  );
};

export default MediaEditor;
