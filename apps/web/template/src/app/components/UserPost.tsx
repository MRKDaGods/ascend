"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Stack,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogTitle,
  CardMedia,
  useTheme,
} from "@mui/material";
import { MoreHoriz, ThumbUp, Comment, Delete, Edit } from "@mui/icons-material";
import { usePostStore, PostType } from "../stores/usePostStore";
import DeletePost from "./DeletePost";
import DocumentPreview from "./DocumentPreview";
// pdfConfig.ts (or inside the component file)
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface UserPostProps {
  post: PostType;
  onDeleteClick?: () => void;
}

// ✅ Convert text with URLs into clickable links
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
        style={{ color: "#0a66c2", wordBreak: "break-all" }}
      >
        {part}
      </a>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
};

const UserPost: React.FC<UserPostProps> = ({ post, onDeleteClick }) => {
  const theme = useTheme();
  const {
    deletePost,
    setOpen,
    setPostText,
    setEditingPost,
    isLastPostDeleted, 
    setLastPostDeleted,
  } = usePostStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    setEditingPost(post);
    handleMenuClose();
  };  

  const handleDelete = () => {
    deletePost(post.id);
    setDeleteDialogOpen(false);
    setLastPostDeleted(true);
    handleMenuClose();
  };

  return (
    <>
    <Card
      sx={{
        mt: 2,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        p: 2,
        maxWidth: "700px",
        mx: "auto",
        transition: "background-color 0.3s ease-in-out",
      }}
    >
      <CardHeader
        avatar={<Avatar src={post.profilePic} />}
        title={
          <Typography fontWeight="bold">
            Ascend Developer •{" "}
            <span style={{ color: theme.palette.text.secondary, fontSize: "0.9rem" }}>
              You
            </span>
          </Typography>
        }
        subheader={
          <Typography color={theme.palette.text.secondary} fontSize="0.9rem">
            {post.timestamp}
          </Typography>
        }
        action={
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreHoriz sx={{ color: theme.palette.text.primary }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleEditPost}>
                <Edit sx={{ mr: 1 }} /> Edit Post
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  if (onDeleteClick) {
                    onDeleteClick();
                  } else {
                    setDeleteDialogOpen(true);
                  }
                }}
              >
                <Delete sx={{ color: "red", mr: 1 }} /> Delete Post
              </MenuItem>
            </Menu>
          </>
        }
      />

      <CardContent>
        <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
          {renderTextWithLinks(post.content)}
        </Typography>

        {post.image && (
          <CardMedia
            component="img"
            image={post.image}
            alt="Uploaded Post Image"
            sx={{ borderRadius: 2, mt: 2, width: "100%", height: "100%" }}
          />
        )}
        {post.video && (
          <CardMedia
            component="video"
            controls
            src={post.video}
            sx={{ borderRadius: 2, mt: 2, maxHeight: 400 }}
          />
        )}
      </CardContent>

      <Stack direction="row" justifyContent="center" spacing={4} sx={{ pt: 1 }}>
        <Button
          startIcon={<ThumbUp />}
          sx={{
            textTransform: "none",
            // color: likedPosts.includes(post.id) ? "#0a66c2" : theme.palette.text.secondary,
            fontWeight: "bold",
          }}
          onClick={() => {}}
        >
          Like
        </Button>
        <Button
          startIcon={<Comment />}
          sx={{
            textTransform: "none",
            color: theme.palette.text.secondary,
            fontWeight: "bold",
          }}
          onClick={() => console.log("Comment Clicked")}
        >
          Comment
        </Button>
      </Stack>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: theme.palette.text.secondary }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
    <DeletePost />
    {post.file && post.title && (
      <DocumentPreview fileUrl={post.file} title={post.title} />
    )}
    </>
  );
};

export default UserPost;
