"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { usePostStore } from "../stores/usePostStore";

interface DeletePostDialogProps {
  open: boolean;
  postId: number;
  onClose: () => void;
}

const DeletePostDialog: React.FC<DeletePostDialogProps> = ({ open, postId, onClose }) => {
  const theme = useTheme();
  const { deletePost, setLastPostDeleted } = usePostStore();

  const handleDelete = () => {
    deletePost(postId);
    setLastPostDeleted(true);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}>
        <Close />
      </IconButton>
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "center" }}>
        Delete post?
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", color: "grey" }}>
        <Typography>
          Are you sure you want to permanently remove this post from Ascend?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button 
        onClick={onClose}           
        sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            color: "#0a66c2",
            border: "2px solid #0a66c2",
            borderRadius: "20px",
            px: 3,
            py: 0.5,
            "&:hover": {
              backgroundColor: "rgba(10, 102, 194, 0.1)",
            },
          }}>
          Cancel
        </Button>
        <Button onClick={handleDelete}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          fontSize: "1rem",
          backgroundColor: "#0a66c2",
          color: "#fff",
          borderRadius: "20px",
          px: 3,
          py: 0.5,
          "&:hover": {
            backgroundColor: "#004182",
          },
        }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePostDialog;
