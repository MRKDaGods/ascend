// Component file: appears after the user clicks repost 

"use client";

import React, {useEffect} from "react";
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
import { MoreHoriz } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { usePostStore } from "../stores/usePostStore";

const SavedPosts: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { posts, savedPosts, fetchSavedPostsAPI } = usePostStore();

  const saved = posts.filter((post) => savedPosts.includes(post.id));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuPostId, setMenuPostId] = React.useState<number | null>(null);

    useEffect(() => {
      fetchSavedPostsAPI();
    }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, postId: number) => {
    setAnchorEl(event.currentTarget);
    setMenuPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPostId(null);
  };

  return (
    <Box
      sx={{
        mt: 4,
        maxWidth: 700,
        mx: "auto",
        px: 2,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Saved Posts
      </Typography>

      {/* Filter Buttons */}
      <Stack direction="row" spacing={1} mb={2}>
        <Button
          variant="contained"
          size="small"
          sx={{
            borderRadius: 20,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          All
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 20,
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Articles
        </Button>
      </Stack>

      {saved.map((post) => {
        const isLink = post.content?.includes("http://") || post.content?.includes("https://");
        const isLong = post.content.length > 200;
        const previewText = isLong ? post.content.slice(0, 200) + "..." : post.content;

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
              {/* Header */}
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
                <IconButton onClick={(e) => handleMenuOpen(e, post.id)}>
                  <MoreHoriz sx={{ color: theme.palette.text.secondary }} />
                </IconButton>
              </Box>

              {/* Content */}
              <Box mt={2}>
                {isLink ? (
                  <>
                    <Typography>{previewText}</Typography>
                    <Box
                      mt={1}
                      p={2}
                      sx={{
                        backgroundColor: theme.palette.action.hover,
                        borderRadius: 2,
                        display: "block",
                      }}
                    >
                      <Typography fontWeight="bold">{post.content}</Typography>
                    </Box>
                  </>
                ) : post.image ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CardMedia
                      component="img"
                      image={post.image}
                      alt="Post image"
                      sx={{
                        width: 90,
                        height: 90,
                        borderRadius: 2,
                        objectFit: "cover",
                      }}
                    />
                    <Typography>{previewText}</Typography>
                  </Box>
                ) : (
                  <Typography>{previewText}</Typography>
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
