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
} from "@mui/material";
import { Close, Image, VideoLibrary, CalendarMonth, AddReaction } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ArticleIcon from "@mui/icons-material/Article";
import { usePostStore } from "../store/usePostStore";

const CreatePost: React.FC = () => {
  const { open, postText, setOpen, setPostText, resetPost } = usePostStore();
  const theme = useTheme(); // Get theme values dynamically

  return (
    <div>
      <Box
        component="section"
        sx={{
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          // width: "700px",
          width: "100%", // ✅ Ensure Full Width
          maxWidth: "700px", // ✅ Restrict to Feed Width
          backgroundColor: theme.palette.background.default, // Adjusts dynamically
          transition: "background-color 0.05s ease-in-out",
          display: "flex", flexDirection: "column", alignItems: "center", mt: 2 
        }}
      >
        <Stack direction="row" spacing={2}>
          <Avatar
            alt="avatar image"
            src="/man.jpg"
            sx={{
              width: 80,
              height: 80,
              border: `2px solid ${theme.palette.mode === "dark" ? "#fff" : "#000"}`,
            }}
          />
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

        <Stack direction="row" justifyContent="space-between">
          <Button
            startIcon={<ImageIcon sx={{ color: "#0073b1" }} />}
            sx={{ textTransform: "none", color: theme.palette.text.primary, fontWeight: "bold", fontSize: "18px", padding: "15px 45px"}}
          >
            Photo
          </Button>

          <Button
            startIcon={<OndemandVideoIcon sx={{ color: "#228B22" }} />}
            sx={{ textTransform: "none", color: theme.palette.text.primary, fontWeight: "bold", fontSize: "18px", padding: "15px 45px" }}
          >
            Video
          </Button>

          <Button
            startIcon={<ArticleIcon sx={{ color: "#D9534F" }} />}
            sx={{ textTransform: "none", color: theme.palette.text.primary, fontWeight: "bold", fontSize: "18px", padding: "15px 45px" }}
          >
            Write article
          </Button>
        </Stack>
      </Box>

      {/* Post Modal (Dialog) */}
      <Dialog
        open={open}
        onClose={resetPost}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.background.paper, // Ensures modal follows theme
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
                <strong>Habiba Hammouda</strong>
                <p style={{ margin: 0, fontSize: "0.8rem", color: theme.palette.text.secondary }}>Post to Anyone</p>
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

        {/* Post Actions (Emoji, Media, Calendar, etc.) */}
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Stack direction="row" spacing={2}>
            <IconButton color="primary"><AddReaction /></IconButton>
            <IconButton color="primary"><Image /></IconButton>
            <IconButton color="primary"><VideoLibrary /></IconButton>
            <IconButton color="primary"><CalendarMonth /></IconButton>
          </Stack>
          <Button
            variant="contained"
            disabled={!postText.trim()}
            onClick={() => {
              console.log("Post Submitted:", postText);
              resetPost();
            }}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreatePost;
