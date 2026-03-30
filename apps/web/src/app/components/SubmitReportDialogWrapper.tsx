"use client";

import React from "react";
import { usePostStore } from "../stores/usePostStore";
import SubmitReportDialog from "./SubmitReportDialog";

const SubmitReportDialogWrapper: React.FC = () => {
  const {
    isSubmitReportDialogOpen,
    selectedReportReason,
    reportDialogPostId,
    closeSubmitReportDialog,
    setPostAsAcknowledged, // Replace the post with the acknowledgement card
    reportThisPostDialogOpen,
    closeReportThisPostDialog, // Ensure this function is called to close the ReportThisPostDialog
  } = usePostStore();

  const handleSubmit = async () => {
    if (reportDialogPostId) {
      setPostAsAcknowledged(reportDialogPostId); // Replace the post with the acknowledgement card
      closeSubmitReportDialog(); // Close the SubmitReportDialog
      closeReportThisPostDialog(); // Close the ReportThisPostDialog
    }
  };

  if (!isSubmitReportDialogOpen || !selectedReportReason || !reportDialogPostId) return null;

  return (
    <SubmitReportDialog
      open={isSubmitReportDialogOpen}
      onClose={closeSubmitReportDialog}
      postId={reportDialogPostId}
      reason={selectedReportReason}
      onSubmit={handleSubmit} // Pass the submit handler
    />
  );
};

export default SubmitReportDialogWrapper;