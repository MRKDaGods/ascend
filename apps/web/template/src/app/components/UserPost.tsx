"use client";

import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Stack,
  Menu,
  MenuItem,
  useTheme,
  CardMedia,
} from "@mui/material";
import { MoreHoriz, ThumbUp, Comment, Delete, Edit } from "@mui/icons-material";
import { usePostStore, PostType } from "../stores/usePostStore";
import { useProfileStore } from "../stores/useProfileStore";
import DeletePostDialog from "./DeletePostDialog";
import DocumentPreview from "./DocumentPreview";
import RepostPreview from "./RepostPreview";

interface UserPostProps {
  post: PostType;
}

const renderTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, index) =>
    urlRegex.test(part) ? (
      <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{ color: "#0a66c2" }}>
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
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const userData = useProfileStore((state) => state.userData);
  const profilePicture = userData?.profile_picture_url || "/default-avatar.png";
  const fullName = userData ? `${userData.first_name} ${userData.last_name}` : "User";

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleEditPost = () => {
    setEditingPost(post);
    handleMenuClose();
  };

  return (
    <>
      <Card
        sx={{
          mt: 2,
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          p: 2,
          maxWidth: "700px",
          mx: "auto",
        }}
      >
        {/* Header */}
        <CardHeader
          avatar={<Avatar src={profilePicture}>{fullName.charAt(0)}</Avatar>}
          title={<Typography fontWeight="bold">{fullName}</Typography>}
          subheader={
            <Typography color="text.secondary" fontSize="0.85rem">
              {post.timestamp} {post.isEdited && "(edited)"}
            </Typography>
          }
          action={
            <>
              <IconButton onClick={handleMenuOpen}>
                <MoreHoriz />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEditPost}>
                  <Edit fontSize="small" sx={{ mr: 1 }} /> Edit Post
                </MenuItem>
                <MenuItem onClick={() => setDeleteDialogOpen(true)}>
                  <Delete fontSize="small" sx={{ mr: 1 }} /> Delete Post
                </MenuItem>
              </Menu>
            </>
          }
        />

        {/* Post Text */}
        <CardContent>
          <Typography variant="body1">{renderTextWithLinks(post.content)}</Typography>
        </CardContent>

        {/* Media Carousel */}
        {post.media && post.media.length > 0 && (
          <Box sx={{ position: "relative", mt: 1 }}>
            {post.media[currentMediaIndex].type === "video" ? (
              <CardMedia
                component="video"
                controls
                src={post.media[currentMediaIndex].url}
                sx={{ width: "100%", borderRadius: 2, maxHeight: 700 }}
              />
            ) : (
              <CardMedia
                component="img"
                image={post.media[currentMediaIndex].url}
                alt="Post media"
                sx={{ width: "100%", borderRadius: 2, maxHeight: 700 }}
              />
            )}

            {/* Arrows */}
            {currentMediaIndex > 0 && (
              <Box
                onClick={() => setCurrentMediaIndex((prev) => prev - 1)}
                sx={arrowStyle("left")}
              >
                {"<"}
              </Box>
            )}
            {currentMediaIndex < post.media.length - 1 && (
              <Box
                onClick={() => setCurrentMediaIndex((prev) => prev + 1)}
                sx={arrowStyle("right")}
              >
                {">"}
              </Box>
            )}

            Counter
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
              {`${currentMediaIndex + 1}/${post.media.length}`}
            </Box>
          </Box>
        )}

        {/* File/PDF */}
        {post.file && post.fileTitle && (
          <Box sx={{ mt: 2 }}>
            <DocumentPreview fileUrl={post.file} title={post.fileTitle} />
          </Box>
        )}

        {/* Repost Preview */}
        {post.repostSourcePost && (
          <Box sx={{ mt: 2 }}>
            <RepostPreview post={post.repostSourcePost} />
          </Box>
        )}

        {/* Buttons */}
        <Stack direction="row" justifyContent="center" spacing={4} sx={{ pt: 1 }}>
          <Button startIcon={<ThumbUp />} sx={buttonStyle(theme)}>
            Like
          </Button>
          <Button startIcon={<Comment />} sx={buttonStyle(theme)}>
            Comment
          </Button>
        </Stack>
      </Card>

      <DeletePostDialog
        open={deleteDialogOpen}
        postId={post.id}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};

const arrowStyle = (side: "left" | "right") => ({
  position: "absolute",
  top: "50%",
  [side]: 16,
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
  zIndex: 2,
});

const buttonStyle = (theme: any) => ({
  textTransform: "none",
  color: theme.palette.text.secondary,
  fontWeight: "bold",
});

export default UserPost;
