"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  Stack,
  Menu,
  MenuItem,
  useTheme,
  Tooltip,
} from "@mui/material";
import { MoreHoriz, Edit, Delete } from "@mui/icons-material";
import { usePostStore, PostType } from "../stores/usePostStore";
import TagInput from "./TagInput";

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

interface CommentProps {
  post: PostType;
  showCommentInput: boolean;
  showComments: boolean;
  setShowComments: (val: boolean) => void;
  fetchedComments: FetchedComment[];
}

const Comment: React.FC<CommentProps> = ({
  post,
  showCommentInput,
  showComments,
  setShowComments,
  fetchedComments,
}) => {
  const theme = useTheme();
  const {
    commentOnPostFromAPI,
    addTagToComment,
    taggedUsers,
    tagUsersOnContent,
  } = usePostStore();

  const [commentText, setCommentText] = useState("");
  const [commentMenuAnchor, setCommentMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState<number | null>(null);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const res = await commentOnPostFromAPI(post.id, commentText);
      const commentId = res?.id; // ✅ no more .data needed

      if (commentId && taggedUsers.length > 0 && commentText.includes("@")) {
        const tagsToSend = taggedUsers.map((tag) => {
          const atIndex = commentText.indexOf(`@${tag.name}`);
          return {
            userId: tag.id,
            startIndex: atIndex,
            endIndex: atIndex + tag.name.length,
          };
        }).filter(tag => tag.startIndex !== -1);

        if (tagsToSend.length > 0) {
          await tagUsersOnContent("comment", commentId, tagsToSend);
        }
      }

      setCommentText("");
      setShowComments(true);
    } catch (err) {
      console.error("❌ Failed to submit comment:", err);
    }
  };

  return (
    <>
      {/* ✍️ Comment Input */}
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
          <Avatar src={post.profilePic || undefined} sx={{ width: 32, height: 32 }}>
            {!post.profilePic && post.username?.charAt(0)}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <TagInput
              postId={post.id}
              isComment
              commentText={commentText}
              setCommentText={setCommentText}
              commentIndex={post.commentsList.length}
              placeholder="Write a comment..."
              onTagSelect={(tag) => addTagToComment(post.id, post.commentsList.length, tag)}
            />
          </Box>

          <Stack>
            <button
              onClick={handleCommentSubmit}
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

      {/* 📜 Comment List */}
      {showComments && (
        <Box sx={{ px: 2, pb: 2 }}>
          {fetchedComments.length === 0 ? (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, py: 1 }}>
              No comments yet. Be the first to comment!
            </Typography>
          ) : (
            fetchedComments.map((comment, index) => (
              <Box key={comment.id} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={comment.user?.profile_picture_url || undefined}
                    sx={{ width: 32, height: 32 }}
                  >
                    {!comment.user?.profile_picture_url && comment.user?.first_name?.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        p: 1,
                        borderRadius: 2,
                        maxWidth: "80%",
                        wordBreak: "break-word",
                      }}
                    >
                      {comment.content}
                    </Typography>
                  </Box>
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
          )}
        </Box>
      )}

      {/* ⚙️ Menu for Edit/Delete */}
      <Menu
        anchorEl={commentMenuAnchor}
        open={Boolean(commentMenuAnchor)}
        onClose={() => setCommentMenuAnchor(null)}
      >
        <MenuItem>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default Comment;
