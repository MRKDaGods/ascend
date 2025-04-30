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
import { useProfileStore } from "../stores/useProfileStore"; // Assuming you fetch user list from here or can adjust

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
  commentIndex,
  placeholder,
}) => {
  const { postText, setPostText, addTagToPost, addTagToComment } = usePostStore();
  const { userData } = useProfileStore(); // Get current user data if needed for filtering
  
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const text = isComment ? commentText || "" : postText;
  const setText = isComment ? setCommentText! : setPostText;

  const [userSuggestions, setUserSuggestions] = useState<Tag[]>([]); // dynamic users

  useEffect(() => {
    const lastAtIndex = text.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      const searchTerm = text.substring(lastAtIndex + 1).trim();
      setQuery(searchTerm);

      if (searchTerm.length >= 0) {
        // Fake fetch users matching query, you can replace with real API later
        setUserSuggestions([
          { id: 18, name: "Habiba" },
          { id: 6, name: "Bibo" },
          { id: 24, name: "Sara" },
        ].filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())));
        
        setShowDropdown(true);
        setAnchorEl(inputRef.current);
      }
    } else {
      setShowDropdown(false);
    }
  }, [text]);

  const handleSelectUser = (user: Tag) => {
    const lastAtIndex = text.lastIndexOf("@");
    if (lastAtIndex === -1) return;

    const newText = text.substring(0, lastAtIndex) + `@${user.name} `;
    setText(newText);

    if (isComment) {
      addTagToComment(postId, commentIndex ?? 0, user);
    } else {
      addTagToPost(postId, user);
    }

    setShowDropdown(false);
    setQuery("");
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
        open={showDropdown && userSuggestions.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <Paper sx={{ mt: 1, width: 250, maxHeight: 200, overflowY: "auto" }} elevation={3}>
          <List dense>
            {userSuggestions.map((user) => (
              <ListItemButton key={user.id} onClick={() => handleSelectUser(user)}>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold">
                      @{user.name}
                    </Typography>
                  }
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
