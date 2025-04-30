"use client";

import React from "react";
import { usePostStore } from "../stores/usePostStore";
import SubmitReportDialog from "./SubmitReportDialog"; // Assuming SubmitReportDialog is already created

const SubmitReportDialogWrapper: React.FC = () => {
  const { isSubmitReportDialogOpen, selectedReportReason, reportDialogPostId, closeSubmitReportDialog } = usePostStore();

  // Only render the dialog if it's open
  if (!isSubmitReportDialogOpen || !selectedReportReason || !reportDialogPostId) return null;

  return (
    <SubmitReportDialog
      open={isSubmitReportDialogOpen}
      onClose={closeSubmitReportDialog}
      postId={reportDialogPostId}
      reason={selectedReportReason}
    />
  );
};

export default SubmitReportDialogWrapper;
