"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  IconButton,
  CardMedia,
  Button,
  useTheme,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { usePostStore } from "../stores/usePostStore";

const renderTextWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, index) =>
    urlRegex.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#0a66c2" }}
      >
        {part}
      </a>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
};

const SavedPosts: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { posts, savedPosts, fetchSavedPostsAPI } = usePostStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPostId, setMenuPostId] = useState<number | null>(null);

  useEffect(() => {
    fetchSavedPostsAPI();
  }, []);

  const saved = posts.filter((post) => savedPosts.includes(post.id));

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        px: 2,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Saved Posts
      </Typography>

      {/* <Stack direction="row" spacing={1} mb={2}>
        <Button variant="contained" size="small" sx={{
          borderRadius: 20,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          "&:hover": { backgroundColor: theme.palette.primary.dark },
        }}>
          All
        </Button>
        <Button variant="outlined" size="small" sx={{
          borderRadius: 20,
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
          "&:hover": { backgroundColor: theme.palette.action.hover },
        }}>
          Articles
        </Button>
      </Stack> */}

      {saved.map((post) => {
        const isLong = post.content.length > 200;
        const previewText = isLong
          ? post.content.slice(0, 200) + "..."
          : post.content;
        const media = post.media?.find(
          (m) => m.type === "image" || m.type === "video"
        );

        return (
          <Box
            key={post.id}
            onClick={() => router.push(`/feed/${post.id}`)}
            sx={{ cursor: "pointer" }}
          >
            <Card
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                boxShadow: 2,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Avatar src={post.profilePic} />
                  <Box>
                    <Typography fontWeight="bold">{post.username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.followers} • {post.timestamp}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Content and Preview */}
              <Box mt={2}>
                {media ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CardMedia
                      component={media.type === "video" ? "video" : "img"}
                      src={media.url}
                      controls={media.type === "video"}
                      sx={{
                        width: 90,
                        height: 90,
                        borderRadius: 2,
                        objectFit: "cover",
                      }}
                    />
                    <Typography>{renderTextWithLinks(previewText)}</Typography>
                  </Box>
                ) : (
                  <Typography>{renderTextWithLinks(previewText)}</Typography>
                )}
              </Box>
            </Card>
          </Box>
        );
      })}

      {saved.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
          No saved posts yet.
        </Typography>
      )}
    </Box>
  );
};

export default SavedPosts;
