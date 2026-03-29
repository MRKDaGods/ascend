// Component file: discarding while adding TEXT ONLY to a newly created post

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

interface DiscardRepostDialogProps {
  open: boolean;
  onClose: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

const DiscardRepostDialog: React.FC<DiscardRepostDialogProps> = ({ open, onClose, onDiscard }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}>
        <Close />
      </IconButton>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>
        Discard draft
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", color: "gray" }}>
        <Typography>You haven’t finished your post yet. Are you sure you want to leave and discard your draft?</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={onClose}
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
          Go back
        </Button>
        <Button
          onClick={onDiscard}
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
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiscardRepostDialog;
