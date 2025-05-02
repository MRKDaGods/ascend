// Component file: when user clicks on Photo/Video

"use client";

import React, { useEffect, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Button
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMediaStore } from "../stores/useMediaStore";
import MediaPreview from "./MediaPreview";
import DiscardMediaDialog from "./DiscardMediaDialog";
import { usePostStore } from "../stores/usePostStore";

const MediaEditor: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    mediaFiles, setMediaFiles, editorOpen, closeEditor,
    discardMediaDialogOpen, closeDiscardMediaDialog, openDiscardMediaDialog, clearAllMedia
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
    if (mediaFiles.length > 0) openDiscardMediaDialog();
    else closeEditor();
  };

  const handleNext = () => {
    closeEditor();
    setOpen(true); // Show PostDialog
  };

  return (
    <>
      <input type="file" accept="image/*,video/*" hidden ref={fileInputRef} onChange={handleFileUpload} />
      {/* <input 
      type="file" 
      accept={mediaType === "image" ? "image/*" : "video/*"}
      hidden ref={fileInputRef} 
      onChange={handleFileUpload} /> */}

      <Dialog 
        open={editorOpen} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="lg"
        PaperProps={{
          sx: {
            height: '80vh', // Changed from minHeight/maxHeight to fixed height
            margin: { xs: 1, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between",
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography fontWeight="bold">Editor</Typography>
          <IconButton onClick={handleClose} size="small"><Close /></IconButton>
        </DialogTitle>

        <DialogContent 
          sx={{
            flex: 1,
            p: '16px !important', // Override MUI default padding
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          {mediaFiles.length > 0 ? (
            <MediaPreview />
          ) : (
            <Box 
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <img src="/select-files.png" style={{ width: 200, height: 'auto' }} />
              <Typography fontWeight="bold">Select files to begin</Typography>
              <Typography color="gray">Share images or a single video in your post.</Typography>
              <Button variant="contained" onClick={() => fileInputRef.current?.click()}>
                Upload from computer
              </Button>
            </Box>
          )}
        </DialogContent>

        {/* Added fixed bottom section for Next button */}
        {mediaFiles.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Box>
        )}
      </Dialog>

      <DiscardMediaDialog open={discardMediaDialogOpen} onClose={closeDiscardMediaDialog} onDiscard={() => {
        clearAllMedia();
        closeDiscardMediaDialog();
        closeEditor();
      }} />
    </>
  );
};

export default MediaEditor;
