"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Stack,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FeedbackDialog from "./FeedbackDialog";
import ReportPolicyDialog from "./ReportPolicyDialog";
import { PostType, usePostStore } from "../stores/usePostStore";

interface Props {
  open: boolean;
  onClose: () => void;
  post: PostType;
}

const ReportThisPostDialog: React.FC<Props> = ({ open, onClose, post }) => {
  const theme = useTheme();
  const { isFeedbackDialogOpen, feedbackDialogPostId, closeFeedbackDialog, openFeedbackDialog, isReportDialogOpen, openReportDialog  } = usePostStore();

  const handleFeedbackClick = () => {
    openFeedbackDialog(post.id);
    onClose();
     };

    const handleReportPostClick = () => {
    console.log("Report Post Clicked");
    openReportDialog();
    onClose();
    };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Report this post
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            Select an action
          </Typography>

          <Stack spacing={2}>
            <Box
                onClick={handleFeedbackClick}
                sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <EditNoteIcon color="primary" />
                <Box>
                  <Typography fontWeight="bold">Provide feedback to change your feed</Typography>
                  <Typography variant="body2" color="text.secondary">
                    If you think this is inappropriate, you can give us feedback instead of reporting.
                  </Typography>
                </Box>
              </Box>
              <ArrowForwardIosIcon fontSize="small" />
            </Box>

            <Box
              onClick={handleReportPostClick}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <ReportProblemIcon color="warning" />
                <Box>
                  <Typography fontWeight="bold">Report content for review</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tell us how this goes against our policies or request help for someone.
                  </Typography>
                </Box>
              </Box>
              <ArrowForwardIosIcon fontSize="small" />
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

       {/* Add the ReportPolicyDialog here */}
       {isReportDialogOpen && (
        <ReportPolicyDialog open={isReportDialogOpen} onClose={onClose} />
      )}
    </>
  );
};

export default ReportThisPostDialog;
