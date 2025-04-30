"use client";

import React from "react";
import { usePostStore } from "../stores/usePostStore";
import ReportPolicyDialog from "./ReportPolicyDialog";

interface ReportPolicyDialogWrapperProps {
  postId: number;
  onReasonSelected: (reason: string) => void; // Ensure this prop is typed
}

const ReportPolicyDialogWrapper: React.FC<ReportPolicyDialogWrapperProps> = ({
  postId,
  onReasonSelected,
}) => {
  const { isReportDialogOpen, closeReportDialog } = usePostStore();

  if (!isReportDialogOpen) return null;

  return (
    <ReportPolicyDialog
      open={isReportDialogOpen}
      onClose={closeReportDialog}
      postId={postId}
      onReasonSelected={onReasonSelected} // Pass the onReasonSelected handler
    />
  );
};

export default ReportPolicyDialogWrapper;