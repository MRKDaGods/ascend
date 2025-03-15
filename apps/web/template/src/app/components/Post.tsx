"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
  Stack,
  Button,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { ThumbUp, Comment, Repeat, Send, MoreHoriz, Link, Edit, Delete } from "@mui/icons-material";
import {usePostStore, PostType } from "../store/usePostStore";

const Post: React.FC<{ post: PostType }> = ({ post }) => {
  const theme = useTheme();
  const { likePost, commentOnPost, repostPost, deleteComment, likedPosts, repostedPosts } = usePostStore();
  
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const [commentMenuAnchor, setCommentMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        transition: "background-color 0.3s ease-in-out",
      }}
    >
      {/* Header Section */}
      <CardHeader
        avatar={<Avatar src={post.profilePic} />}
        title={<Typography fontWeight="bold">{post.username}</Typography>}
        subheader={<Typography color={theme.palette.text.secondary}>{post.followers} • {post.timestamp}</Typography>}
        action={<IconButton><MoreHoriz /></IconButton>}
      />

      {/* Post Content */}
      <CardContent>
        <Typography variant="body1">{post.content}</Typography>
      </CardContent>

      {/* Post Media (Optional) */}
      {post.image && <CardMedia component="img" image={post.image} alt="Post image" sx={{ maxHeight: 400, objectFit: "cover" }} />}

      {/* Engagement Info */}
      <Box sx={{ px: 2, py: 1, color: theme.palette.text.secondary }}>
        <Typography variant="body2">
          👍 {post.likes} •  
          <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowComments(!showComments)}>
            {post.comments} comments
          </span> • {post.reposts} reposts
        </Typography>
      </Box>

      {/* Post Actions */}
      <Stack direction="row" justifyContent="space-around" sx={{ p: 1 }}>
        <Button startIcon={<ThumbUp />} sx={{ textTransform: "none", color: likedPosts.includes(post.id) ? "#0a66c2" : theme.palette.text.secondary, fontWeight: "bold" }} onClick={() => likePost(post.id)}>
          Like
        </Button>
        <Button startIcon={<Comment />} sx={{ textTransform: "none", color: theme.palette.text.secondary, fontWeight: "bold" }} onClick={() => setShowCommentInput(!showCommentInput)}>
          Comment
        </Button>
        <Button startIcon={<Repeat />} sx={{ textTransform: "none", color: repostedPosts.includes(post.id) ? "#0a66c2" : theme.palette.text.secondary, fontWeight: "bold" }} onClick={() => repostPost(post.id)}>
          Repost
        </Button>
        <Button startIcon={<Send />} sx={{ textTransform: "none", color: theme.palette.text.secondary, fontWeight: "bold" }}>
          Send
        </Button>
      </Stack>

      {/* Comment Input */}
      {showCommentInput && (
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Avatar src="/profile.jpg" />
          <TextField fullWidth placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2 }} />
          <Button variant="contained" onClick={() => { if (commentText.trim()) { commentOnPost(post.id, commentText); setCommentText(""); setShowCommentInput(false); }}}>
            Comment
          </Button>
        </Box>
      )}

      {/* Comments Section */}
      {showComments && (
        <Box sx={{ px: 2, pb: 2, backgroundColor: theme.palette.background.default, borderTop: `1px solid ${theme.palette.divider}` }}>
          {post.commentsList.length > 0 ? (
            post.commentsList.map((comment, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar src="/profile.jpg" sx={{ width: 32, height: 32 }} />
                  <Typography variant="body2" sx={{ backgroundColor: theme.palette.background.paper, p: 1, borderRadius: 2 }}>
                    {comment}
                  </Typography>
                </Box>
                <IconButton onClick={(e) => { setCommentMenuAnchor(e.currentTarget); setSelectedCommentIndex(index); }}>
                  <MoreHoriz />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color={theme.palette.text.secondary} sx={{ py: 1 }}>No comments yet. Be the first to comment!</Typography>
          )}
        </Box>
      )}

      {/* Comment Menu */}
      <Menu anchorEl={commentMenuAnchor} open={Boolean(commentMenuAnchor)} onClose={() => setCommentMenuAnchor(null)}>
        <MenuItem><Link /> Copy link to comment</MenuItem>
        <MenuItem><Edit /> Edit</MenuItem>
        <MenuItem onClick={() => setDeleteDialogOpen(true)}><Delete /> Delete</MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete your comment?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={() => { deleteComment(post.id, selectedCommentIndex!); setDeleteDialogOpen(false); }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Post;
