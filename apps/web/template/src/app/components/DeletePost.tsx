"use client";

import React from "react";
import { usePostStore } from "@/app/stores/usePostStore";
import { Typography, Box, useTheme } from "@mui/material";

const DeletePost = () => {
  const { isLastPostDeleted } = usePostStore();
  const theme = useTheme();

  return (
    <>
      {isLastPostDeleted && (
        <Box
          id="post-deleted-message" // ✅ ID added
          sx={{
            textAlign: "center",
            mt: 5,
            color: theme.palette.text.primary,
          }}
        >
          <Typography fontWeight="bold" fontSize="1.2rem">
            Post removed
          </Typography>
          <Typography color={theme.palette.text.secondary}>
            Post successfully deleted.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default DeletePost;
