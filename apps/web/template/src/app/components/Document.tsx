"use client";

import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Typography, Box, Input, TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
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
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setDocumentTitle("");
  };

  const handleDone = () => {
    if (!selectedFile || !documentTitle.trim()) return;

    const url = URL.createObjectURL(selectedFile);
    useMediaStore.getState().setDocumentPreview(selectedFile, documentTitle);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Share a document</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 2 }}>
        {!selectedFile ? (
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
              inputProps={{ accept: ".pdf" }}
            />
          </Box>
        ) : (
          <>
            <TextField
              label="Document title"
              fullWidth
              size="small"
              required
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              sx={{ mt: 1, mb: 2 }}
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
              <IconButton size="small" onClick={handleRemoveFile} sx={{ position: "absolute", top: 8, right: 8 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        )}

        <Typography variant="body2" color="text.secondary" fontSize={12}>
          Viewers can download your document as a PDF.{" "}
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
          onClick={handleDone}
          variant="contained"
          disabled={!selectedFile || !documentTitle.trim()}
          sx={{ borderRadius: 20 }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Document;
