import FeedbackDialog from "./FeedbackDialog";
import { usePostStore } from "../stores/usePostStore";
import { PostType } from "../stores/usePostStore";

const FeedbackDialogWrapper = ({ post }: { post: PostType }) => {
  const {
    isFeedbackDialogOpen,
    feedbackDialogPostId,
    closeFeedbackDialog,
  } = usePostStore();

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
