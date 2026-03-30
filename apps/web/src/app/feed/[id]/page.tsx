//Page: renders CONNECTIONPOST to display the post

"use client";

import React, { useEffect } from "react";
import {
  Box,
  Container,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Navbar from "@/app/components/Navbar";
import CreatePost from "@/app/components/CreatePost";
import UserPost from "@/app/components/UserPost";
import FeedbackAcknowledgement from "@/app/components/FeedbackAcknowledgement";
import ProfileCard from "@/app/components/ProfileCard";
import WhosHiringCard from "@/app/components/WhosHiringCard";
import Footer from "@/app/components/Footer";
import TryPremCard from "@/app/components/TryPremCard";
import ManageFeedCard from "@/app/components/ManageFeedCard";
import SidebarPreview from "@/app/components/SidebarPreview";

import { usePostStore } from "@/app/stores/usePostStore";
import { useProfileStore } from "@/app/stores/useProfileStore";

import { api } from "@/api";

import { useParams } from "next/navigation";
import ConnectionPost from "@/app/components/ConnectionPost";

const ViewPostPage = () => {
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Navbar />

      <Container
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: { xs: "stretch", md: "flex-start" },
          gap: 3,
          px: { xs: 1, sm: 2 },
          maxWidth: "1400px",
          pb: 5,
        }}
      >
        {/* Left Panel */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "280px" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: { md: "sticky" },
            top: { md: "80px" },
            alignSelf: "flex-start",
          }}
        >
          <></>
        </Box>

        {/* Center Feed */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            top: { md: "80px" },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "600px" }}>
            <ConnectionPost post={selectedPost} />
          </Box>
        </Box>

        {/* Right Panel */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "300px" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: { md: "sticky" },
            top: { md: "80px" },
            alignSelf: "flex-start",
          }}
        > 
          <Footer />
        </Box>
      </Container>
    </Box>
  );
};

export default ViewPostPage;
