//Page: special for copying posts

"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Navbar from "@/app/components/Navbar";
import ConnectionPost from "@/app/components/ConnectionPost";
import { usePostStore } from "@/app/stores/usePostStore";

const CopyPostPage = () => {
    const theme = useTheme();
  const { id } = useParams();
  const selectedPost = usePostStore((state) => state.selectedPost);
  const fetchPost = usePostStore((state) => state.fetchPostFromAPI);

  useEffect(() => {
    if (id) {
      fetchPost(Number(id));
    }
  }, [id, fetchPost]);

  if (!selectedPost) return <div style={{ padding: 20 }}>Loading post...</div>;

  return (
    <>
      <Navbar />
      <Box
        sx={{
          margin: "0 auto",
          width: "100%",
          padding: 2,
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "calc(100vh - 64px)",
        }}
      >
      <ConnectionPost post={selectedPost} />
      </Box>
    </>
  );
};

export default CopyPostPage;
