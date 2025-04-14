// Component file: comment for each connection post

"use client";

import React, { useState } from "react";
import {
  Avatar, Box, IconButton, Typography, Stack, Menu,
  MenuItem, Dialog, DialogActions, DialogTitle, useTheme,
} from "@mui/material";
import { MoreHoriz, Link, Edit, Delete } from "@mui/icons-material";
import { usePostStore, PostType } from "../stores/usePostStore";
import TagInput from "./TagInput";

interface CommentProps {
  post: PostType;
  showCommentInput: boolean;
  showComments: boolean;
  setShowComments: (val: boolean) => void;
}

const Comment: React.FC<CommentProps> = ({
  post,
  showCommentInput,
  showComments,
  setShowComments,
}) => {
  const theme = useTheme();
  const { commentOnPost, deleteComment, addTagToComment } = usePostStore();

  const [commentText, setCommentText] = useState("");
  const [commentMenuAnchor, setCommentMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleCommentDelete = () => {
    if (selectedCommentIndex !== null) {
      deleteComment(post.id, selectedCommentIndex);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      {showCommentInput && (
        <Box
          sx={{
            px: 2,
            pb: 2,
            display: "flex",
            gap: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Avatar src="/profile.jpg" sx={{ width: 36, height: 36 }} />
          <Box sx={{ flexGrow: 1 }}>
            <TagInput
              postId={post.id}
              isComment
              commentText={commentText}
              setCommentText={setCommentText}
              commentIndex={post.commentsList.length}
              placeholder="Write a comment..."
              onTagSelect={(tag) => {
                addTagToComment(post.id, post.commentsList.length, tag);
              }}
            />
          </Box>
          <Stack>
            <button
              onClick={() => {
                if (commentText.trim()) {
                  commentOnPost(post.id, commentText);
                  setCommentText("");
                  setShowComments(true);
                }
              }}
              style={{
                backgroundColor: "#0a66c2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Comment
            </button>
          </Stack>
        </Box>
      )}

      {showComments && (
        <Box sx={{ px: 2, pb: 2 }}>
          {post.commentsList.length > 0 ? (
            post.commentsList.map((comment, index) => (
              <Box key={index} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src="/profile.jpg" sx={{ width: 32, height: 32 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      p: 1,
                      borderRadius: 2,
                    }}
                  >
                    {comment}
                  </Typography>
                </Box>
                <IconButton
                  onClick={(e) => {
                    setCommentMenuAnchor(e.currentTarget);
                    setSelectedCommentIndex(index);
                  }}
                >
                  <MoreHoriz />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary, py: 1 }}
            >
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>
      )}

      {/* Menu for comment actions */}
      <Menu
        anchorEl={commentMenuAnchor}
        open={Boolean(commentMenuAnchor)}
        onClose={() => setCommentMenuAnchor(null)}
      >
        <MenuItem><Link fontSize="small" sx={{ mr: 1 }} /> Copy link to comment</MenuItem>
        <MenuItem><Edit fontSize="small" sx={{ mr: 1 }} /> Edit</MenuItem>
        <MenuItem onClick={() => setDeleteDialogOpen(true)}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Delete confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete your comment?</DialogTitle>
        <DialogActions>
          <button onClick={() => setDeleteDialogOpen(false)}>Cancel</button>
          <button style={{ color: "red" }} onClick={handleCommentDelete}>
            Delete
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Comment;
