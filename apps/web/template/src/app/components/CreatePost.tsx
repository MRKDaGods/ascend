"use client";

import React, { useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Stack,
  Box,
  useTheme,
} from "@mui/material";
import { Close, Image, VideoLibrary, CalendarMonth, AddReaction } from "@mui/icons-material";
import { usePostStore } from "../store/usePostStore";
import UserPost from "./UserPost";

const CreatePost: React.FC = () => {
  const { open, postText, setOpen, setPostText, resetPost, addPost, posts } = usePostStore();
  const theme = useTheme();
  const [media, setMedia] = useState<string | null>(null);

  // ✅ Handle new post submission
  const handlePost = () => {
    if (postText.trim()) {
      addPost(postText, media || undefined);
      resetPost();
      setMedia(null);
    }
  };

  return (
    <div>
      {/* ✅ Main Box for "Start a Post" Section */}
      <Box
        component="section"
        sx={{
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          width: "100%",
          maxWidth: "700px",
          backgroundColor: theme.palette.background.default,
          transition: "background-color 0.05s ease-in-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
        }}
      >
        {/* ✅ Avatar & Input Section */}
        <Stack direction="row" spacing={2}>
          <Avatar alt="User Profile" src="/man.jpg" sx={{ width: 80, height: 80 }} />
          <Box
            component="section"
            sx={{
              p: 2,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 20,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpen(true)}
              sx={{
                width: "500px",
                textTransform: "none",
                borderRadius: 5,
                fontWeight: "bold",
                color: theme.palette.text.secondary,
                fontSize: "18px",
                justifyContent: "flex-start",
                padding: "5px 15px",
                borderColor: "transparent",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.text.primary,
                  cursor: "pointer",
                },
              }}
            >
              Start a post
            </Button>
          </Box>
        </Stack>

        {/* ✅ Media Upload Buttons (Outside Modal) */}
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, width: "100%" }}>
          <Button startIcon={<Image sx={{ color: "#0073b1" }} />} sx={{ textTransform: "none" }}>
            Photo
          </Button>
          <Button startIcon={<VideoLibrary sx={{ color: "#228B22" }} />} sx={{ textTransform: "none" }}>
            Video
          </Button>
          <Button startIcon={<CalendarMonth sx={{ color: "#D9534F" }} />} sx={{ textTransform: "none" }}>
            Write article
          </Button>
        </Stack>
      </Box>

      {/* ✅ Post Modal (Popup) */}
      <Dialog
        open={open}
        onClose={resetPost}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        {/* Header */}
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src="/profile.jpg" />
              <Box>
                <strong>Ascend Developer • You</strong>
                <p style={{ margin: 0, fontSize: "0.8rem", color: theme.palette.text.secondary }}>
                  Software Engineer at Microsoft
                </p>
              </Box>
            </Stack>
            <IconButton onClick={resetPost}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        {/* Post Content */}
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder="What do you want to talk about?"
            variant="standard"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            sx={{
              fontSize: "1.2rem",
              width: "100%",
              color: theme.palette.text.primary,
            }}
          />
        </DialogContent>

        {/* ✅ Media Upload Options Inside Modal */}
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Stack direction="row" spacing={2}>
            <IconButton color="primary"><AddReaction /></IconButton>
            <IconButton color="primary"><Image /></IconButton>
            <IconButton color="primary"><VideoLibrary /></IconButton>
            <IconButton color="primary"><CalendarMonth /></IconButton>
          </Stack>
          <Button variant="contained" disabled={!postText.trim()} onClick={handlePost}>
            Post
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ User Posts Appearing in Feed Using `UserPost.tsx` */}
      {posts.map((post) => (
        <UserPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default CreatePost;
