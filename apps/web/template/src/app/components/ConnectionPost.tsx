"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { usePostStore, PostType } from "../stores/usePostStore";
import PostActions from "./PostActions";
import Comment from "./Comment";
import SaveandLink from "./SaveandLink";

// Type for fetched comments
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

// Utility to detect and link URLs
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

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
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
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        width: "100%",
        maxWidth: "600px",
        mx: "auto",
      }}
    >
      {/* Header */}
      <CardHeader
        avatar={
          <Avatar src={post.profilePic || undefined}>
            {!post.profilePic && post.username?.charAt(0)}
          </Avatar>
        }
        title={<Typography fontWeight="bold">{post.username}</Typography>}
        subheader={
          <Typography fontSize="0.75rem" color="text.secondary">
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

      {/* Media Carousel */}
      {post.media && post.media.length > 0 && (
        <Box sx={{ position: "relative", mt: 2 }}>
          {post.media[currentMediaIndex].type === "video" ? (
            <video
              src={post.media[currentMediaIndex].url}
              controls
              style={{
                width: "100%",
                objectFit: "cover",
                borderRadius: "0 0 12px 12px",
                maxHeight: "500px",
              }}
            />
          ) : (
            <img
              src={post.media[currentMediaIndex].url}
              alt={`Post media ${currentMediaIndex}`}
              style={{
                width: "100%",
                objectFit: "cover",
                borderRadius: "0 0 12px 12px",
                maxHeight: "500px",
              }}
            />
          )}

          {/* Left Arrow */}
          {currentMediaIndex > 0 && (
            <Box
              onClick={() => setCurrentMediaIndex((prev) => prev - 1)}
              sx={{
                position: "absolute",
                top: "50%",
                left: 16,
                transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.5)",
                color: "white",
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                fontWeight: "bold",
              }}
            >
              {"<"}
            </Box>
          )}

          {/* Right Arrow */}
          {currentMediaIndex < post.media.length - 1 && (
            <Box
              onClick={() => setCurrentMediaIndex((prev) => prev + 1)}
              sx={{
                position: "absolute",
                top: "50%",
                right: 16,
                transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.5)",
                color: "white",
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                fontWeight: "bold",
              }}
            >
              {">"}
            </Box>
          )}

          {/* Media Counter */}
          {post.media &&
          post.media.filter((media) => media.type === "image").length > 1 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                px: 1.5,
                py: 0.5,
                borderRadius: "16px",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              {`${currentMediaIndex + 1}/${post.media.filter(
                (media) => media.type === "image"
              ).length}`}
            </Box>
          )}
        </Box>
      )}

      {/* PDF Document Preview */}
      {post.file && post.fileTitle && (
        <Box sx={{ mt: 2 }}>
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
          <Typography
            fontSize="0.8rem"
            color="text.secondary"
            textAlign="center"
            mt={1}
          >
            <a
              href={post.file}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#0a66c2" }}
            >
              View or download {post.fileTitle}
            </a>
          </Typography>
        </Box>
      )}

      {/* Likes, Comments, Reposts */}
      <Box sx={{ px: 2, py: 1, color: theme.palette.text.secondary, fontSize: "0.875rem" }}>
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

      {/* Action Buttons */}
      <PostActions
        postId={post.id}
        liked={!!postReactions[post.id]}
        reposted={false}
        onLike={() => {}}
        onRepost={handleRepost}
        onCommentClick={() => setShowCommentInput((prev) => !prev)}
      />

      {/* Comments Section */}
      <Comment
        post={post}
        showCommentInput={showCommentInput}
        showComments={showComments}
        setShowComments={setShowComments}
        fetchedComments={fetchedComments}
      />
    </Card>
  );
};

export default ConnectionPost;
