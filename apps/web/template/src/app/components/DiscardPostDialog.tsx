"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface DiscardPostDialogProps {
  open: boolean;
  onClose: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

const DiscardPostDialog: React.FC<DiscardPostDialogProps> = ({ open, onClose, onDiscard, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}>
        <Close />
      </IconButton>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>
        Save this post as a draft?
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", color: "gray" }}>
        <Typography>The post you started will be here when you return.</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onDiscard}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            color: "#0a66c2",
            border: "2px solid #0a66c2",
            borderRadius: "20px",
            px: 3,
            py: 0.5,
            "&:hover": {
              backgroundColor: "rgba(10, 102, 194, 0.1)",
            },
          }}
        >
          Discard
        </Button>
        <Button
          onClick={onSave}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            backgroundColor: "#0a66c2",
            color: "#fff",
            borderRadius: "20px",
            px: 3,
            py: 0.5,
            "&:hover": {
              backgroundColor: "#004182",
            },
          }}
        >
          Save as draft
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiscardPostDialog;
