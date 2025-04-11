// Component file: adding a document to a created post

"use client";

import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Typography, Box, Input, TextField, Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { usePostStore } from "../stores/usePostStore";
import { useMediaStore } from "../stores/useMediaStore";

interface DocumentProps {
  open: boolean;
  onClose: () => void;
}

const Document: React.FC<DocumentProps> = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, "")); // auto fill title
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setDocumentTitle("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Share a document</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 2 }}>
        {!selectedFile ? (
          <>
            <Box
              component="label"
              htmlFor="upload-doc"
              sx={{
                display: "block",
                border: "1px solid #0a66c2",
                color: "#0a66c2",
                textAlign: "center",
                borderRadius: 20,
                px: 3,
                py: 1,
                cursor: "pointer",
                fontWeight: 500,
                mt: 1,
                mb: 2,
                "&:hover": {
                  backgroundColor: "rgba(10, 102, 194, 0.1)"
                }
              }}
            >
              Choose file
              <Input
                type="file"
                id="upload-doc"
                sx={{ display: "none" }}
                onChange={handleFileChange}
                inputProps={{
                  accept: ".doc,.docx,.pdf,.ppt,.pptx"
                }}
              />
            </Box>
          </>
        ) : (
          <>
            <TextField
              label="Document title"
              required
              fullWidth
              variant="outlined"
              size="small"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Add a descriptive title to your document"
              sx={{  mt: 1, mb: 2 }}
            />

            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 2,
                mb: 2,
                display: "flex",
                alignItems: "center",
                position: "relative"
              }}
            >
              <InsertDriveFileIcon fontSize="large" color="disabled" sx={{ mr: 2 }} />

              <Box>
                <Typography fontWeight={500}>{selectedFile.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </Typography>
              </Box>

              <IconButton
                size="small"
                onClick={handleRemoveFile}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        )}

        <Typography variant="body2" color="text.secondary" fontSize={12}>
          For accessibility purposes, LinkedIn members who can view your post will be able to download your document as a PDF.&nbsp;
          <a href="https://www.linkedin.com/help/linkedin/answer/119964" target="_blank" rel="noopener noreferrer" style={{ color: "#0a66c2" }}>
            Learn more
          </a>
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 20 }}>
          Back
        </Button>
        <Button
            variant="contained"
            disabled={!selectedFile || !documentTitle.trim()}
            sx={{ borderRadius: 20 }}
            onClick={() => {
                if (!selectedFile) return;

                const previewUrl = URL.createObjectURL(selectedFile);

                // Save media to media store
                useMediaStore.getState().setMediaPreviews([previewUrl]);

                // Save file title to post store
                const postStore = usePostStore.getState();
                const editing = postStore.editingPost;

                postStore.setEditingPost({
                ...(editing || {
                    id: Date.now(), // fallback dummy id
                    username: "You",
                    profilePic: "/profile.jpg",
                    followers: "You",
                    timestamp: "Just now",
                    content: "",
                    likes: 0,
                    reposts: 0,
                    comments: 0,
                    commentsList: [],
                    isUserPost: true,
                }),
                file: previewUrl,
                title: documentTitle,
                });

                onClose(); // close dialog
            }}
            >
            Done
            </Button>

      </DialogActions>
    </Dialog>
  );
};

export default Document;
