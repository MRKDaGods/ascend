"use client";

import React from "react";
import ReportPolicyDialog from "./ReportPolicyDialog"; // Assuming it's imported correctly
import { usePostStore } from "../stores/usePostStore";
import { PostType } from "../stores/usePostStore";

const ReportPolicyDialogWrapper = ({ post }: { post: PostType }) => {
  const { isReportDialogOpen, closeReportDialog } = usePostStore();

  // Only render the dialog if it's open
  if (!isReportDialogOpen) return null;

  return (
    <ReportPolicyDialog
      open={isReportDialogOpen}
      onClose={closeReportDialog}  // Close the dialog when needed
    />
  );
};

export default ReportPolicyDialogWrapper;
