"use client";

import React, {useEffect} from "react";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { usePostStore } from "../stores/usePostStore";
import AddMedia from "./AddMedia";
import UserPostPopup from "./UserPostPopup";
import CreatePostDialog from "./CreatePostDialog";

const CreatePost: React.FC = () => {
  const theme = useTheme();
  const { open, setOpen } = usePostStore();

  return (
    <div>
      <Box
        component="section"
        sx={{
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          width: "600px",
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
            onClick={() => setOpen(true) }
          >
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: "14px", fontWeight: "bold" }}>
              Start a post
            </Typography>
          </Box>
        </Stack>

        <AddMedia />
      </Box>

     {typeof window !== 'undefined' && open && <CreatePostDialog />}

      {/* ✅ Popup shown only on post creation */}
      <UserPostPopup />

    </div>
  );
};

export default CreatePost;
