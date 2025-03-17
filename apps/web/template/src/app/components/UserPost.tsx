"use client";

import React from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Stack,
  Button,
  useTheme,
  Box,
} from "@mui/material";
import { MoreHoriz, ThumbUp, Comment } from "@mui/icons-material";
import { PostType } from "../store/usePostStore";

const UserPost: React.FC<{ post: PostType }> = ({ post }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        mt: 2,
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        p: 2,
        maxWidth: "700px",
      }}
    >
      {/* ✅ Post Header */}
      <CardHeader
        avatar={<Avatar src="/profile.jpg" />}
        title={
          <Typography fontWeight="bold">
            Ascend Developer • <span style={{ color: "gray", fontSize: "0.9rem" }}>You</span>
          </Typography>
        }
        subheader={
          <Typography color="gray" fontSize="0.9rem">
            Software Engineer at Microsoft • 1m ago • <span style={{ fontSize: "1rem" }}>👥</span>
          </Typography>
        }
        action={<IconButton><MoreHoriz /></IconButton>}
      />

      {/* ✅ Post Content */}
      <CardContent>
        <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
          {post.content.split(" ").map((word, i) =>
            word.startsWith("#") ? (
              <span key={i} style={{ color: "#0a66c2", cursor: "pointer" }}>
                {word}{" "}
              </span>
            ) : (
              word + " "
            )
          )}
        </Typography>
      </CardContent>

      {/* ✅ Centered Like & Comment Row */}
      <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, mt: 1, pt: 1 }}>
        <Stack direction="row" justifyContent="center" spacing={8}>
          <Button
            startIcon={<ThumbUp />}
            sx={{ textTransform: "none", color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Like
          </Button>
          <Button
            startIcon={<Comment />}
            sx={{ textTransform: "none", color: theme.palette.text.secondary, fontWeight: "bold" }}
          >
            Comment
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default UserPost;
