"use client";

import React, { useState } from "react";
import {
  Avatar, Box, Card, CardContent, CardHeader, CardMedia, IconButton,
  Typography, Menu, MenuItem, useTheme,
} from "@mui/material";
import { MoreHoriz, Bookmark } from "@mui/icons-material";
import { usePostStore, PostType } from "../stores/usePostStore";
import PostActions from "./PostActions";
import SavePostPopup from "./SavePostPopup";
import Comment from "./Comment";
import UnsavePopup from "./UnsavePopup";

const ConnectionPost: React.FC<{ post: PostType }> = ({ post }) => {
  const theme = useTheme();
  const {
    likePost, commentOnPost, repostPost, deleteComment,
    likedPosts, repostedPosts, savedPosts, toggleSavePost, setSavedPopupOpen, setUnsavedPopupOpen
  } = usePostStore();
  

  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
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
        action={
          <>
            <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
              <MoreHoriz />
            </IconButton>
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={() => setMenuAnchorEl(null)}>
                {savedPosts.includes(post.id) ? (
                  <MenuItem
                    onClick={() => {
                      toggleSavePost(post.id);
                      setUnsavedPopupOpen(true); // ✅ Show unsave popup
                      setMenuAnchorEl(null);
                    }}
                  >
                    <Bookmark sx={{ fontSize: 18, mr: 1 }} />
                    <Box>
                      <Typography fontWeight="bold">Unsave</Typography>
                      <Typography fontSize="0.75rem" color="gray">
                        Unsave from your saved list
                      </Typography>
                    </Box>
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => {
                      toggleSavePost(post.id);
                      setSavedPopupOpen(true); // ✅ Show save popup
                      setMenuAnchorEl(null);
                    }}
                  >
                    <Bookmark sx={{ fontSize: 18, mr: 1 }} />
                    Save
                  </MenuItem>
                )}
              </Menu>        
          </>
        }
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

      {/* Post buttons */}
      <PostActions
        postId={post.id}
        liked={likedPosts.includes(post.id)}
        reposted={repostedPosts.includes(post.id)}
        onLike={() => likePost(post.id)}
        onRepost={() => repostPost(post.id)}
        onCommentClick={() => setShowCommentInput(!showCommentInput)}
      />

      {/* Comments Section */}
      <Comment
        post={post}
        showCommentInput={showCommentInput}
        showComments={showComments}
        setShowComments={setShowComments}
      />
      <SavePostPopup />
      <UnsavePopup />
    </Card>
  );
};

export default ConnectionPost;
