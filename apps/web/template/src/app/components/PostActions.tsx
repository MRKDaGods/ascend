"use client";

import React from "react";
import { Button, Stack, useTheme } from "@mui/material";
import { ThumbUp, Comment, Repeat, Send } from "@mui/icons-material";

interface Props {
  postId: number;
  liked: boolean;
  reposted: boolean;
  onLike: () => void;
  onRepost: () => void;
  onCommentClick: () => void;
}

const PostActions: React.FC<Props> = ({
  liked,
  reposted,
  onLike,
  onRepost,
  onCommentClick,
}) => {
  const theme = useTheme();

  return (
    <Stack direction="row" justifyContent="space-around" sx={{ px: 2, py: 1 }}>
      <Button
        startIcon={<ThumbUp />}
        onClick={onLike}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          color: liked ? "#0a66c2" : theme.palette.text.secondary,
        }}
      >
        Like
      </Button>
      <Button
        startIcon={<Comment />}
        onClick={onCommentClick}
        sx={{ textTransform: "none", fontWeight: "bold", color: theme.palette.text.secondary }}
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
        sx={{ textTransform: "none", fontWeight: "bold", color: theme.palette.text.secondary }}
      >
        Send
      </Button>
    </Stack>
  );
};

export default PostActions;
