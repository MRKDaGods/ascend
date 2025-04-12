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
  CardMedia,
  useTheme,
} from "@mui/material";
import { MoreHoriz, ThumbUp, Comment, Delete, Edit } from "@mui/icons-material";
import { usePostStore, PostType } from "../stores/usePostStore";
import DeletePostDialog from "./DeletePostDialog";
import DocumentPreview from "./DocumentPreview";

interface UserPostProps {
  post: PostType;
  onDeleteClick?: () => void;
}

// Convert text URLs to clickable links
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

const UserPost: React.FC<UserPostProps> = ({ post }) => {
  const theme = useTheme();
  const { setEditingPost } = usePostStore();

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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
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
        }}
      >
        <CardHeader
          avatar={<Avatar src={post.profilePic} />}
          title={
            <Typography fontWeight="bold">
              Ascend Developer •{" "}
              <span style={{ color: theme.palette.text.secondary, fontSize: "0.9rem" }}>You</span>
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
                <MenuItem onClick={handleDeleteClick}>
                  <Delete sx={{ mr: 1 }} /> Delete Post
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

          {/* ✅ Show document preview */}
          {post.file && post.fileTitle && (
            <Box sx={{ mt: 2 }}>
              <DocumentPreview fileUrl={post.file} title={post.fileTitle} />
            </Box>
          )}
        </CardContent>

        <Stack direction="row" justifyContent="center" spacing={4} sx={{ pt: 1 }}>
          <Button
            startIcon={<ThumbUp />}
            sx={{ textTransform: "none", color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Like
          </Button>
          <Button
            startIcon={<Comment />}
            sx={{ textTransform: "none", color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Comment
          </Button>
        </Stack>

        <DeletePostDialog
          open={deleteDialogOpen}
          postId={post.id}
          onClose={() => setDeleteDialogOpen(false)}
        />
      </Card>
    </>
  );
};

export default UserPost;
