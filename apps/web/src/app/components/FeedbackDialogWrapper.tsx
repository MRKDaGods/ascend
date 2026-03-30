"use client";

import FeedbackDialog from "./FeedbackDialog";
import { usePostStore } from "../stores/usePostStore";
import { PostType } from "../stores/usePostStore";

const FeedbackDialogWrapper = ({ post }: { post: PostType }) => {
  const {
    isFeedbackDialogOpen,
    feedbackDialogPostId,
    closeFeedbackDialog,
  } = usePostStore();

  // Ensure the dialog only renders for the correct post
  if (!isFeedbackDialogOpen || feedbackDialogPostId !== post.id) return null;

  return (
    <FeedbackDialog
      open={isFeedbackDialogOpen}
      onClose={closeFeedbackDialog}
      postId={feedbackDialogPostId}
    />
  );
};

export default FeedbackDialogWrapper;