"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { usePostStore } from "@/app/stores/usePostStore";
import CloseIcon from "@mui/icons-material/Close";

const ReportPolicyDialog: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { setReportDialogReason, reportPostFromAPI, selectedPost } = usePostStore();

  // Possible reasons for reporting the post
  const reasons = [
    { label: "Harassment", value: "harassment" },
    { label: "Violence", value: "violence" },
    { label: "Hate Speech", value: "hate_speech" },
    { label: "Misinformation", value: "misinformation" },
    { label: "Other", value: "other" },
  ];

  // Handle the click event for selecting a report reason
  const handleReasonClick = async (reason: string) => {
    if (selectedPost?.id) { // Ensure the selectedPost is valid
      setReportDialogReason(reason); // Store the selected reason in the state
      try {
        // Attempt to report the post via the API
        await reportPostFromAPI(selectedPost.id, reason, "");
        onClose(); // Close the dialog once the post is successfully reported
      } catch (error) {
        console.error("Error reporting post:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        Report Post
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="subtitle2" color="text.secondary" mb={2}>
          Select a reason for reporting:
        </Typography>

        <Box>
          {/* Map over the reasons array to create the buttons */}
          {reasons.map((reason) => (
            <Button
              key={reason.value}
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
              onClick={() => handleReasonClick(reason.value)} // Handle reason selection
            >
              {reason.label}
            </Button>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        {/* Cancel button to close the dialog without taking any action */}
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportPolicyDialog;
