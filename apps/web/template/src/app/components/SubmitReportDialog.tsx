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
import { usePostStore } from "@/app/stores/usePostStore";

const SubmitReportDialog: React.FC<{ open: boolean; onClose: () => void; postId: number; reason: string }> = ({
  open,
  onClose,
  postId,
  reason,
}) => {
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const { reportPostFromAPI, closeAllDialogs } = usePostStore();

  const handleSubmit = async () => {
    try {
      await reportPostFromAPI(postId, "other" ,reason);
      // closeAllDialogs();
      onClose();

      console.log("Report submitted:", { postId, reason, receiveUpdates });
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