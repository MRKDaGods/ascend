"use client";

import React from "react";
import { Button, Stack, useTheme } from "@mui/material";
import { Comment, Repeat, Send } from "@mui/icons-material";
import Reactions from "./Reactions";

interface Props {
  postId: number;
  liked: boolean;
  reposted: boolean;
  onLike: () => void;
  onRepost: () => void;
  onCommentClick: () => void;
}

const PostActions: React.FC<Props> = ({
  postId,
  liked,
  reposted,
  onLike,
  onRepost,
  onCommentClick,
}) => {
  const theme = useTheme();

  return (
    <Stack direction="row" justifyContent="space-around" sx={{ px: 2, py: 1, position: "relative" }}>
      <Reactions postId={postId} liked={liked} onLike={onLike} />

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

      <Button
        startIcon={<Repeat />}
        onClick={onRepost}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          color: reposted ? "#0a66c2" : theme.palette.text.secondary,
        }}
      >
        Repost
      </Button>

      <Button
        startIcon={<Send />}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          color: theme.palette.text.secondary,
        }}
      >
        Send
      </Button>
    </Stack>
  );
};

export default PostActions;
