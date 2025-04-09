"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Popper,
  Paper,
} from "@mui/material";
import { usePostStore, Tag } from "../stores/usePostStore";

const sampleUsers: Tag[] = [
  { id: 1, name: "Mohamed" },
  { id: 2, name: "Ahmed" },
  { id: 3, name: "Sara" },
  { id: 4, name: "Nour" },
];

interface TagInputProps {
    postId: number;
    isComment?: boolean;
    commentText?: string;
    setCommentText?: (val: string) => void;
    commentIndex?: number;
    placeholder?: string;
    onTagSelect?: (tag: Tag) => void; 
  }

const TagInput: React.FC<TagInputProps> = ({
  postId,
  isComment = false,
  commentText,
  setCommentText,
}) => {
  const { postText, setPostText, addTagToPost, addTagToComment } = usePostStore();

  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const text = isComment ? commentText || "" : postText;
  const setText = isComment ? setCommentText! : setPostText;

  useEffect(() => {
    const lastChar = text.slice(-1);
    if (lastChar === "@") {
      setShowDropdown(true);
      setAnchorEl(inputRef.current);
    } else if (!text.includes("@")) {
      setShowDropdown(false);
    }
  }, [text]);

  const handleSelect = (user: Tag) => {
    const atIndex = text.lastIndexOf("@");
    const newText = text.substring(0, atIndex) + `@${user.name} `;
    setText(newText);
    if (isComment) {
      const commentIndex = usePostStore.getState().posts.find((p) => p.id === postId)?.commentsList.length ?? 0;
      addTagToComment(postId, commentIndex, user);
    } else {
      addTagToPost(postId, user);
    }
    setShowDropdown(false);
  };

  return (
    <>
      <TextField
        fullWidth
        inputRef={inputRef}
        multiline
        placeholder={isComment ? "Write a comment..." : "What do you want to talk about?"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="standard"
        InputProps={{
          disableUnderline: true, // 👈 THIS disables the line
        }}
      />

      <Popper
        open={showDropdown}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <Paper sx={{ mt: 1, width: 250, maxHeight: 200, overflowY: "auto" }} elevation={3}>
          <List dense>
            {sampleUsers.map((user) => (
              <ListItemButton key={user.id} onClick={() => handleSelect(user)}>
                <ListItemText primary={<Typography fontWeight="bold">@{user.name}</Typography>} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Popper>
    </>
  );
};

export default TagInput;
