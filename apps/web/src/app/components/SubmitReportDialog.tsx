"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePostStore } from "../stores/usePostStore";

const SubmitReportDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  postId: number;
  reason: string;
  onSubmit: () => void; // Add onSubmit prop
}> = ({ open, onClose, postId, reason, onSubmit }) => {
  const [receiveUpdates, setReceiveUpdates] = useState(false);

  const handleSubmit = async () => {
    try {
      onSubmit(); // Call the onSubmit handler to replace the post and close dialogs
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        You've selected the following reason: {reason}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="subtitle2" color="text.secondary" mb={2}>
          Want to follow the status of your report?
        </Typography>

        <FormControlLabel
          control={<Checkbox checked={receiveUpdates} onChange={(e) => setReceiveUpdates(e.target.checked)} />}
          label="Receive updates on this report"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Back
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitReportDialog;