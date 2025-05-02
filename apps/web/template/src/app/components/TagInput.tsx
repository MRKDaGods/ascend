"use client";

import {
  Box,
  Typography,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Popper,
  Paper,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { usePostStore } from "../stores/usePostStore";
import { useConnectionStore } from "../stores/useConnectionStore";

interface TagInputProps {
  postId: number;
  isComment?: boolean;
  commentText?: string;
  setCommentText?: (val: string) => void;
  commentIndex?: number;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  postId,
  isComment = false,
  commentText,
  setCommentText,
  commentIndex,
  placeholder,
}) => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { postText, setPostText, tagUsersInPost } = usePostStore();
  const { connections, fetchConnections } = useConnectionStore();

  const text = isComment ? commentText || "" : postText;
  const setText = isComment ? setCommentText! : setPostText;

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    const lastAtIndex = text.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      const searchTerm = text.substring(lastAtIndex + 1).trim();
      setQuery(searchTerm);

      if (searchTerm.length >= 0) {
        setShowDropdown(true);
        setAnchorEl(inputRef.current);
      }
    } else {
      setShowDropdown(false);
    }
  }, [text]);

  const filteredConnections = connections
    .map((c) => ({ id: c.user_id, name: `${c.first_name} ${c.last_name}` }))
    .filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));

  const handleSelectUser = async (user: { id: number; name: string }) => {
    const lastAtIndex = text.lastIndexOf("@");
    if (lastAtIndex === -1) return;

    const before = text.substring(0, lastAtIndex);
    const newMention = `@${user.name}`;
    const newText = before + newMention + " ";
    setText(newText);

    const startIndex = before.length;
    const endIndex = startIndex + newMention.length;

    const payload = {
      contentType: isComment ? ("comment" as "comment") : ("post" as "post"),
      contentId: postId,
      tags: [
        {
          userId: user.id,
          startIndex,
          endIndex,
        },
      ],
    };

    console.log("📦 Sending tag payload:", payload);

    try {
      await tagUsersInPost(payload);
    } catch (error) {
      console.error("❌ Failed to tag user:", error);
    }

    setQuery("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <TextField
        fullWidth
        inputRef={inputRef}
        multiline
        placeholder={
          placeholder ||
          (isComment
            ? "Write a comment..."
            : "Start writing or use @ to mention people...")
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="standard"
        InputProps={{
          disableUnderline: true,
        }}
      />

      <Popper
        open={showDropdown && filteredConnections.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <Paper
          sx={{ mt: 1, width: 250, maxHeight: 200, overflowY: "auto" }}
          elevation={3}
        >
          <List dense>
            {filteredConnections.map((user) => (
              <ListItemButton key={user.id} onClick={() => handleSelectUser(user)}>
                <ListItemText
                  primary={<Typography fontWeight="bold">@{user.name}</Typography>}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Popper>
    </>
  );
};

export default TagInput;
