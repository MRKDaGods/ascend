"use client";

import React from "react";
import { usePostStore } from "../stores/usePostStore";
import ReportPolicyDialog from "./ReportPolicyDialog";
import SubmitReportDialog from "./SubmitReportDialog";

const ReportDialogWrapper = ({ postId }: { postId: number }) => {
  const {
    isReportDialogOpen,
    isSubmitReportDialogOpen,
    selectedReportReason,
    reportDialogPostId,
    closeReportDialog,
    closeSubmitReportDialog,
    setPostAsAcknowledged,
  } = usePostStore();

  const handleReasonSelected = (reason: string) => {
    // Open the SubmitReportDialog with the selected reason
    usePostStore.getState().openSubmitReportDialog(postId, reason);
    closeReportDialog(); // Close the ReportPolicyDialog
  };

  const handleSubmit = async () => {
    if (reportDialogPostId) {
      setPostAsAcknowledged(reportDialogPostId); // Replace the post with the acknowledgement card
      closeSubmitReportDialog(); // Close the SubmitReportDialog
    }
  };

  // Render the ReportPolicyDialog
  if (isReportDialogOpen && reportDialogPostId === postId) {
    return (
      <ReportPolicyDialog
        open={isReportDialogOpen}
        onClose={closeReportDialog}
        postId={postId}
        onReasonSelected={handleReasonSelected}
      />
    );
  }

  // Render the SubmitReportDialog
  if (isSubmitReportDialogOpen && reportDialogPostId === postId) {
    return (
      <SubmitReportDialog
        open={isSubmitReportDialogOpen}
        onClose={closeSubmitReportDialog}
        postId={postId}
        reason={selectedReportReason || ""}
        onSubmit={handleSubmit}
      />
    );
  }

  return null;
};

export default ReportDialogWrapper;