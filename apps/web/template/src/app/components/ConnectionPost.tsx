// Component file: posts in feed page, from connections and followers

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
} from "@mui/material";
import { usePostStore, PostType } from "../stores/usePostStore";
import PostActions from "./PostActions";
import Comment from "./Comment";
import Save from "./Save";

const ConnectionPost: React.FC<{ post: PostType }> = ({ post }) => {
  const theme = useTheme();
  const {
    repostPost,
    postReactions,
  } = usePostStore();

  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        minWidth: "450px",
        maxWidth: "580px",
        margin: "0 auto",
      }}
    >
      <CardHeader
        avatar={<Avatar src={post.profilePic} />}
        title={<Typography fontWeight="bold">{post.username}</Typography>}
        subheader={
          <Typography color={theme.palette.text.secondary} fontSize="0.75rem">
            {post.followers} • {post.timestamp}
          </Typography>
        }
        action={ <Save post={post} /> }
      />

      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" fontSize="1rem">
          {post.content}
        </Typography>
      </CardContent>

      {post.image && (
        <CardMedia
          component="img"
          image={post.image}
          alt="Post image"
          sx={{
            width: "100%",
            maxHeight: 450,
            objectFit: "cover",
            borderRadius: "0 0 12px 12px",
          }}
        />
      )}

      <Box sx={{ px: 2, py: 1, color: theme.palette.text.secondary, fontSize: "0.875rem" }}>
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

      <PostActions
        postId={post.id}
        liked={!!postReactions[post.id]}
        reposted={false} // handled by repostedPosts if needed
        onLike={() => {}} // handled in Reactions component
        onRepost={() => repostPost(post.id)}
        onCommentClick={() => setShowCommentInput(!showCommentInput)}
      />

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