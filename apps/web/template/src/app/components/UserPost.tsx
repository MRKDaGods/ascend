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
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#0a66c2" }}
      >
        {part}
      </a>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
};

const arrowStyle = (side: "left" | "right") => ({
  position: "absolute",
  top: "50%",
  [side]: 8,
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
  transition: "opacity 0.3s",
});

const buttonStyle = (theme: any) => ({
  textTransform: "none",
  color: theme.palette.text.secondary,
  fontWeight: "bold",
});

const UserPost: React.FC<UserPostProps> = ({ post }) => {
  const theme = useTheme();
  const { setEditingPost } = usePostStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const userData = useProfileStore((state) => state.userData);
  const profilePicture = userData?.profile_picture_url || "/default-avatar.png";
  const fullName = userData ? `${userData.first_name} ${userData.last_name}` : "User";

  const totalMedia = post.media?.length || 0;

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

        {/* Media Section */}
        {totalMedia > 0 && post.media && !post.file && (
          <Box sx={{ position: "relative", mt: 1 }}>
            {post.media[currentIndex].type === "video" ? (
              <CardMedia
                component="video"
                controls
                src={post.media[currentIndex].url}
                sx={{ width: "100%", borderRadius: 2, maxHeight: 800 }}
              />
            ) : (
              <CardMedia
                component="img"
                image={post.media[currentIndex].url}
                alt={`Post media ${currentIndex + 1}`}
                sx={{ width: "100%", borderRadius: 2, maxHeight: 800 }}
              />
            )}

            {/* Arrows */}
            {totalMedia > 1 && (
              <>
                <Box
                  onClick={() => currentIndex > 0 && setCurrentIndex((prev) => prev - 1)}
                  sx={arrowStyle("left")}
                  style={{
                    opacity: currentIndex > 0 ? 1 : 0.4,
                    pointerEvents: currentIndex > 0 ? "auto" : "none",
                  }}
                >
                  {"<"}
                </Box>
                <Box
                  onClick={() => currentIndex < totalMedia - 1 && setCurrentIndex((prev) => prev + 1)}
                  sx={arrowStyle("right")}
                  style={{
                    opacity: currentIndex < totalMedia - 1 ? 1 : 0.4,
                    pointerEvents: currentIndex < totalMedia - 1 ? "auto" : "none",
                  }}
                >
                  {">"}
                </Box>

                {/* Media Counter */}
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
                    zIndex: 2,
                  }}
                >
                  {`${currentIndex + 1}/${totalMedia}`}
                </Box>
              </>
            )}
          </Box>
        )}

        {/* PDF or File Preview */}
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

        {/* Actions */}
        <Stack direction="row" justifyContent="center" spacing={4} sx={{ pt: 1 }}>
          <Button startIcon={<ThumbUp />} sx={buttonStyle(theme)}>
            Like
          </Button>
          <Button startIcon={<Comment />} sx={buttonStyle(theme)}>
            Comment
          </Button>
        </Stack>
      </Card>

      {/* Delete Confirmation */}
      <DeletePostDialog
        open={deleteDialogOpen}
        postId={post.id}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};

export default UserPost;
