"use client";

import React from "react";
import { Button, Stack, useTheme } from "@mui/material";
import { Comment, Send } from "@mui/icons-material";
import Reactions from "./Reactions";
import { usePostStore } from "../stores/usePostStore";
import { useUserStore } from "../stores/useUserStore";
import SendPostDialog from "./SendPostDialog";
import CopyPostPopup from "./CopyPostPopup";
import RepostOptions from "./RepostOptions";

interface Props {
  postId: number;
  liked: boolean;
  reposted: boolean;
  onLike: () => void;
  onRepost: () => void;
  onCommentClick: () => void;
}


const PostActions: React.FC<Props> = ({ postId, onCommentClick }) => {
  const theme = useTheme();
  const {
    postReactions,
    repostedPosts,
    setReaction,
    clearReaction,
    posts,
    setCopyPostPopupOpen,
  } = usePostStore();

  const {
    connections,
    sendDialogOpen,
    setSendDialogOpen,
  } = useUserStore();

  const liked = postReactions[postId] !== undefined;
  const reposted = repostedPosts.includes(postId);
  const post = posts.find((p) => p.id === postId);
  const authorName = post?.username ?? "this user";

  const enrichedConnections = connections.map((conn) => ({
    id: conn.id,
    name: conn.name,
    title: conn.headline,
    avatar: conn.avatar,
    isOnline: conn.isOnline,
    isAuthor: conn.name === authorName,
  }));

  const handleCopyLink = () => {
    const link = `${window.location.origin}/feed/post/${postId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopyPostPopupOpen(true);
    });
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-around" sx={{ px: 2, py: 1, position: "relative" }}>
        <Reactions
          postId={postId}
          liked={liked}
          onLike={() => (liked ? clearReaction(postId) : setReaction(postId, "Like"))}
        />

        <Button
          startIcon={<Comment />}
          onClick={onCommentClick}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            color: theme.palette.text.secondary,
          }}
        >
          Comment
        </Button>

        <RepostOptions postId={postId} />

        <Button
          startIcon={<Send />}
          onClick={() => setSendDialogOpen(true)}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            color: theme.palette.text.secondary,
          }}
        >
          Send
        </Button>
      </Stack>

      <SendPostDialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
        authorName={authorName}
        connections={enrichedConnections}
        postId={postId}
      />

      <CopyPostPopup />
    </>
  );
};

export default PostActions;
