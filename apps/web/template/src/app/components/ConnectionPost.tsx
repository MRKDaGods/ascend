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

// New: Define Comment type for local usage
interface FetchedComment {
  id: number;
  post_id: number;
  user_id: number;
  parent_comment_id: number | null;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    profile_picture_url: string | null;
  };
  replies: any[];
}

const renderTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, index) =>
    urlRegex.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#0a66c2", wordBreak: "break-word" }}
      >
        {part}
      </a>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
};

const ConnectionPost: React.FC<{ post: PostType }> = ({ post }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { repostFromAPI, postReactions, fetchCommentsForPostFromAPI } = usePostStore();

  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [fetchedComments, setFetchedComments] = useState<FetchedComment[]>([]);

  const handleRepost = async () => {
    await repostFromAPI(post.id, "");
  };

  return (
    <Card
      sx={{
        mb: 2,
        p: 2,
        boxShadow: 3,
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
        <Typography variant="body1" sx={{ fontSize: "1rem" }}>
          {renderTextWithLinks(post.content)}
        </Typography>
      </CardContent>

      {/* Media Preview */}
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

      {/* PDF Preview */}
      {post.file && post.fileTitle && (
        <Box sx={{ mt: 2, width: "100%" }}>
          <iframe
            src={post.file}
            title={post.fileTitle}
            style={{
              width: "100%",
              height: "500px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
          <Typography fontSize="0.8rem" color="text.secondary" textAlign="center" mt={1}>
            <a href={post.file} target="_blank" rel="noopener noreferrer" style={{ color: "#0a66c2" }}>
              View or download {post.fileTitle}
            </a>
          </Typography>
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
    id="view-comments-button"
    style={{ cursor: "pointer", textDecoration: "underline" }}
    onClick={async () => {
      setShowComments((prev) => !prev);
      if (post.comments > 0 && fetchedComments.length === 0) {
        try {
          const comments = await fetchCommentsForPostFromAPI(post.id);
          setFetchedComments(comments); 
        } catch (error) {
          console.error("❌ Failed to fetch comments:", error);
        }
      }
    }}
  >
    {post.comments} comments
  </span>{" "}
  • {post.reposts} reposts
</Typography>

      </Box>

      {/* Actions */}
      <PostActions
        postId={post.id}
        liked={!!postReactions[post.id]}
        reposted={false}
        onLike={() => {}}
        onRepost={handleRepost}
        onCommentClick={() => setShowCommentInput(!showCommentInput)}
      />

      {/* Comment Section */}
      <Comment
        post={post}
        showCommentInput={showCommentInput}
        showComments={showComments}
        setShowComments={setShowComments}
        fetchedComments={fetchedComments} // Pass the real fetched comments
      />
    </Card>
  );
};

export default ConnectionPost;
