"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
  Typography,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { usePostStore } from "../stores/usePostStore";

interface Connection {
  id: number;
  name: string;
  title: string;
  avatar: string;
  isOnline?: boolean;
  isAuthor?: boolean;
}

interface SendPostDialogProps {
  open: boolean;
  onClose: () => void;
  authorName: string;
  connections: Connection[];
  postId: number;
}

const SendPostDialog: React.FC<SendPostDialogProps> = ({
  open,
  onClose,
  authorName,
  connections,
  postId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { setCopyPostPopupOpen } = usePostStore();

  const handleToggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredConnections = connections.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = () => {
    const postLink = `${window.location.origin}/feed/post/${postId}`;
    navigator.clipboard.writeText(postLink).then(() => {
      setCopyPostPopupOpen(true);
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography fontWeight={600}>
          Send {authorName.split(" ")[0]}'s Post
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <InputBase
          placeholder="Type a name"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ border: "1px solid #ccc", borderRadius: 2, px: 2, py: 1, mb: 2 }}
        />

        <List>
          {filteredConnections.map((connection) => (
            <ListItem
              key={connection.id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={() => handleToggle(connection.id)}
                  checked={selectedIds.includes(connection.id)}
                />
              }
            >
              <ListItemAvatar>
                <Avatar src={connection.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    {connection.name}
                    {connection.isAuthor && (
                      <Box
                        component="span"
                        sx={{
                          ml: 1,
                          background: "#e6f0ff",
                          color: "#0a66c2",
                          px: 1,
                          borderRadius: 1,
                          fontSize: 12,
                        }}
                      >
                        Author
                      </Box>
                    )}
                  </>
                }
                secondary={connection.title}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-start", px: 3, pb: 2 }}>
        <Button
          startIcon={<ContentCopyIcon />}
          onClick={handleCopyLink}
          sx={{ textTransform: "none" }}
        >
          Copy link to post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendPostDialog;
