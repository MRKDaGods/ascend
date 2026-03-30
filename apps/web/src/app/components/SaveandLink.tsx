"use client";

import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { MoreHoriz, Bookmark, Link as LinkIcon } from "@mui/icons-material";
import { usePostStore, PostType } from "../stores/usePostStore";
import SavePostPopup from "./SavePostPopup";
import UnsavePopup from "./UnsavePopup";
import CopyPostPopup from "./CopyPostPopup";
import FlagIcon from "@mui/icons-material/Flag";
import ReportThisPostDialog from "./ReportThisPostDialog";
import ReportPolicyDialogWrapper from "./ReportPolicyDialogWrapper"; // Use the unified wrapper
import FeedbackDialogWrapper from "./FeedbackDialogWrapper";

const SaveandLink: React.FC<{ post: PostType }> = ({ post }) => {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const {
    savedPosts,
    toggleSavePostAPI,
    setCopyPostPopupOpen,
    openReportDialog,
    openFeedbackDialog,
  } = usePostStore();

  const [reportThisPostDialogOpen, setReportThisPostDialogOpen] = useState(false);

  const isSaved = savedPosts.includes(post.id);

  // Handle the copy link to post
  const handleCopyLink = () => {
    const link = `${window.location.origin}/post/${post.id}`; // Adjust link format if needed
    navigator.clipboard.writeText(link);
    setCopyPostPopupOpen(true); // Show the feedback popup that the link was copied
    setMenuAnchorEl(null);
  };

  // Handle opening report post dialog
  const handleReportPost = () => {
    openReportDialog(post.id);
    setReportThisPostDialogOpen(true);
    setMenuAnchorEl(null);
  };

  // Handle feedback click
  const handleFeedbackClick = () => {
    openFeedbackDialog(post.id);
    setReportThisPostDialogOpen(false); // Close report dialog if feedback is clicked
  };

  return (
    <>
      <IconButton
        id="post-menu-button"
        onClick={(e) => setMenuAnchorEl(e.currentTarget)}
      >
        <MoreHoriz />
      </IconButton>

      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem
          id="save-post-button"
          onClick={async () => {
            await toggleSavePostAPI(post.id);
            setMenuAnchorEl(null);
          }}
        >
          <Bookmark sx={{ fontSize: 18, mr: 1 }} />
          {isSaved ? (
            <Box>
              <Typography fontWeight="bold">Unsave</Typography>
              <Typography fontSize="0.75rem" color="gray">
                Unsave from your saved list
              </Typography>
            </Box>
          ) : (
            <Typography fontWeight="semibold">Save</Typography>
          )}
        </MenuItem>

        <MenuItem id="copy-post-link-button" onClick={handleCopyLink}>
          <LinkIcon sx={{ fontSize: 18, mr: 1 }} />
          <Typography fontWeight="semibold">Copy link to post</Typography>
        </MenuItem>

        <MenuItem id="report-post-button" onClick={handleReportPost}>
          <FlagIcon sx={{ fontSize: 18, mr: 1 }} />
          <Typography fontWeight="semibold">Report Post</Typography>
        </MenuItem>
      </Menu>

      <SavePostPopup />
      <UnsavePopup />
      <CopyPostPopup />

      {/* Report This Post Dialog */}
      <ReportThisPostDialog
        open={reportThisPostDialogOpen}
        onClose={() => setReportThisPostDialogOpen(false)}
        post={post}
        onFeedbackClick={handleFeedbackClick} // Pass feedback handler
        onReportContentClick={() => openReportDialog(post.id)} // Open ReportPolicyDialog
      />

      {/* Unified Report Dialog Wrapper */}
      <ReportPolicyDialogWrapper postId={post.id} />

      {/* Feedback Dialog */}
      <FeedbackDialogWrapper post={post} />
    </>
  );
};

export default SaveandLink;