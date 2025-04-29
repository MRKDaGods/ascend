"use client";

import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  IconButton,
  ClickAwayListener,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePostStore } from "../stores/usePostStore";

const SearchResults: React.FC = () => {
  const { searchResults, setSearchResults } = usePostStore();

  if (!searchResults) return null;

  const { users, posts } = searchResults;

  return (
    <ClickAwayListener onClickAway={() => setSearchResults(null)}>
      <Box
        sx={{
          position: "absolute",
          top: "64px", // below navbar
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          width: "min(600px, 90%)",
          maxHeight: "70vh",
          overflowY: "auto",
          zIndex: 1300,
          boxShadow: 5,
          p: 2,
        }}
      >
        {/* ❌ Close Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <IconButton size="small" onClick={() => setSearchResults(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* USERS */}
        {users.length > 0 && (
          <>
            <Typography variant="h6" mb={1}>Users</Typography>
            {users.map((user) => (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                  p: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "action.hover",
                    cursor: "pointer",
                  },
                }}
              >
                <Avatar
                src={
                    typeof user.profile_picture_url === "string" &&
                    user.profile_picture_url.startsWith("http")
                    ? user.profile_picture_url
                    : undefined
                }
                />
                <Box>
                  <Typography fontWeight="bold">
                    {user.first_name} {user.last_name}
                  </Typography>
                  {user.bio && (
                    <Typography variant="body2" color="text.secondary">
                      {user.bio}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* POSTS */}
        {posts.length > 0 && (
          <>
            <Typography variant="h6" mb={1}>Posts</Typography>
            {posts.map((post) => (
              <Card
                key={post.id}
                sx={{
                  mb: 2,
                  p: 2,
                  boxShadow: 2,
                  borderRadius: 3,
                  backgroundColor: "background.default",
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                    src={
                      typeof post.profilePic === "string" &&
                      post.profilePic.startsWith("http")
                        ? post.profilePic
                        : undefined
                    }
                  />
                  }
                  title={<Typography fontWeight="bold">{post.username}</Typography>}
                  subheader={
                    <Typography fontSize="0.75rem" color="text.secondary">
                      {post.timestamp}
                    </Typography>
                  }
                />
                <CardContent sx={{ pt: 0 }}>
                  <Typography fontSize="1rem" sx={{ wordBreak: "break-word" }}>
                    {post.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* NO RESULTS */}
        {users.length === 0 && posts.length === 0 && (
          <Typography textAlign="center" color="text.secondary" py={2}>
            No results found.
          </Typography>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchResults;
