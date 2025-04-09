"use client";

import React from "react";
import { usePostStore } from "@/app/stores/usePostStore";
import { Typography, Box } from "@mui/material";

const DeletePost = () => {
  const { isLastPostDeleted } = usePostStore();

  return (
    <>
      {isLastPostDeleted && (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography fontWeight="bold" fontSize="1.2rem">
            Post removed
          </Typography>
          <Typography color="gray">Post successfully deleted.</Typography>
        </Box>
      )}
    </>
  );
};

export default DeletePost;
