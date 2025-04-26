"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { usePostStore, PostType } from "../stores/usePostStore";
import PostActions from "./PostActions";
import Comment from "./Comment";
import SaveandLink from "./SaveandLink";
import DocumentPreview from "./DocumentPreview";

const ConnectionPost: React.FC<{ post: PostType }> = ({ post }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    repostFromAPI,
    postReactions,
  } = usePostStore();

  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleRepost = async () => {
    await repostFromAPI(post.id, "");
  };

  return (
    <Card
      sx={{
        mb: 2,
        p: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        width: "100%",
        maxWidth: "600px",
        mx: "auto",
      }}
    >
      {/* Post Header */}
      <CardHeader
        avatar={
          <Avatar src={post.profilePic || undefined}>
            {!post.profilePic && post.username?.charAt(0)}
          </Avatar>
        }
        title={<Typography fontWeight="bold">{post.username}</Typography>}
        subheader={
          <Typography color={theme.palette.text.secondary} fontSize="0.75rem">
            {post.followers} • {post.timestamp}
          </Typography>
        }
        action={<SaveandLink post={post} />}
      />

      {/* Post Content */}
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" fontSize="1rem">
          {post.content}
        </Typography>
      </CardContent>

      {/* Media Preview Logic */}
      {post.image && !post.video && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post image"
          sx={{
            width: "100%",
            objectFit: "cover",
            borderRadius: "0 0 12px 12px",
          }}
        />
      )}

      {post.video && (
        <Box sx={{ mt: 2 }}>
          <video
            controls
            style={{
              width: "100%",
              borderRadius: "0 0 12px 12px",
              maxHeight: "500px",
              objectFit: "cover",
            }}
          >
            <source src={post.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      )}

      {/* PDF Document Preview */}
      {post.file && post.fileTitle && (
        <Box sx={{ mt: 2 }}>
          <DocumentPreview fileUrl={post.file} title={post.fileTitle} />
        </Box>
      )}

      {/* Post Statistics */}
      <Box
        sx={{
          px: 2,
          py: 1,
          color: theme.palette.text.secondary,
          fontSize: "0.875rem",
        }}
      >
        <Typography variant="body2">
          👍 {post.likes} •{" "}
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => setShowComments(!showComments)}
          >
            {post.comments} comments
          </span>{" "}
          • {post.reposts} reposts
        </Typography>
      </Box>

      {/* Post Actions (Like, Comment, Repost) */}
      <PostActions
        postId={post.id}
        liked={!!postReactions[post.id]}
        reposted={false}
        onLike={() => {}}
        onRepost={handleRepost}
        onCommentClick={() => setShowCommentInput(!showCommentInput)}
      />

      {/* Comments Section */}
      <Comment
        post={post}
        showCommentInput={showCommentInput}
        showComments={showComments}
        setShowComments={setShowComments}
      />
    </Card>
  );
};

export default ConnectionPost;
