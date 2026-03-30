"use client";

import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import { CompanyPost } from "@/app/stores/useCompanyPostStore";

interface CompanyRepostPreviewProps {
  post: CompanyPost;
}

const CompanyRepostPreview = ({ post }: CompanyRepostPreviewProps) => {
  return (
    <Card variant="outlined" sx={{ mt: 2, p: 1 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar src={"/default-avatar.jpg"} sx={{ width: 32, height: 32 }} />
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

export default CompanyRepostPreview;
