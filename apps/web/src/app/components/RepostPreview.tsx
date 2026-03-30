"use client";

import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import { PostType } from "@/app/stores/usePostStore";

interface RepostPreviewProps {
  post: PostType;
}

const RepostPreview = ({ post }: RepostPreviewProps) => {
  return (
    <Card variant="outlined" sx={{ mt: 2, p: 1 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src={post.profilePic} sx={{ width: 32, height: 32 }} />
          <Box>
            <Typography fontWeight="bold" fontSize={14}>
              {post.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {post.followers} • {post.timestamp}
            </Typography>
          </Box>
        </Box>

        <Typography mt={1}>{post.content}</Typography>

        {post.image && (
          <Box mt={1}>
            <img src={post.image} alt="Repost media" style={{ width: "100%", borderRadius: 8 }} />
          </Box>
        )}
        {post.video && (
          <Box mt={1}>
            <video src={post.video} controls style={{ width: "100%", borderRadius: 8 }} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RepostPreview;
