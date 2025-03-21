"use client";

import React from "react";
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
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { usePostStore } from "../store/usePostStore";
import UserPost from "./UserPost";
import AddMedia from "./AddMedia";

const CreatePost: React.FC = () => {
  const { open, postText, setOpen, setPostText, resetPost, addPost, posts } = usePostStore();
  const theme = useTheme();

  const handlePost = () => {
    if (postText.trim()) {
      addPost(postText);
      resetPost();
    }
  };

  return (
    <div>
      <Box
        component="section"
        sx={{
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          width: "100%",
          maxWidth: "570px",
          backgroundColor: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
          mx: "auto",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%", px: 2 }}>
          <Avatar alt="User Profile" src="/man.jpg" sx={{ width: 48, height: 48 }} />
          <Box
            sx={{
              flexGrow: 1,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 50,
              backgroundColor: theme.palette.background.default,
              px: 2,
              py: 1.5,
              cursor: "pointer",
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
            onClick={() => setOpen(true)}
          >
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "14px", fontWeight: "bold" }}>
              Start a post
            </Typography>
          </Box>
        </Stack>

        <AddMedia />
      </Box>

      <Dialog open={open} onClose={resetPost} fullWidth maxWidth="md">
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src="/profile.jpg" />
              <Box>
                <Typography fontWeight="bold">Ascend Developer • You</Typography>
                <Typography color="gray" fontSize="0.8rem">
                  Software Engineer at Microsoft
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={resetPost}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder="What do you want to talk about?"
            variant="standard"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            sx={{ fontSize: "1.2rem", width: "100%" }}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button variant="contained" disabled={!postText.trim()} onClick={handlePost}>
            Post
          </Button>
        </DialogActions>
      </Dialog>

      {posts.map((post) => (
        <UserPost key={post.id} post={post} />
      ))}
    </div>
  );
};

export default CreatePost;
