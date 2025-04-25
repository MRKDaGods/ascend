"use client";

import React from "react";
import { Button, Box, Stack, useTheme } from "@mui/material";
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
  if (!post) return null;

  const authorName = post.username;
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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 1,
          mt: 1,
          px: { xs: 1, sm: 2 },
        }}
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="space-evenly"
          spacing={1.5}
          sx={{
            width: "100%",
            py: 1,
            px: { xs: 0, sm: 2 },
          }}
        >
          <Reactions
            postId={postId}
            liked={liked}
            onLike={() => (liked ? clearReaction(postId) : setReaction(postId, "Like"))}
          />

          <Button
            startIcon={<Comment />}
            onClick={onCommentClick}
            sx={{
              minWidth: 100,
              textTransform: "none",
              fontWeight: "bold",
              color: theme.palette.text.secondary,
            }}
          >
            Comment
          </Button>

          <RepostOptions post={post} />

          <Button
            startIcon={<Send />}
            onClick={() => setSendDialogOpen(true)}
            sx={{
              minWidth: 80,
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
      </Box>
    </>
  );
};

export default PostActions;
