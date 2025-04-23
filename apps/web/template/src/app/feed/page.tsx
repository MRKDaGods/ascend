"use client";

import React, { useEffect } from "react";
import { Box, Container, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import ConnectionPost from "../components/ConnectionPost";
import ProfileCard from "../components/ProfileCard";
import JobsCard from "../components/JobsCard";
import Footer from "../components/Footer";
import ConnectionsCard from "../components/ConnectionsCard";
import SalesNavCard from "../components/SalesNavCard";
import QuickLinksCard from "../components/QuickLinksCard";

import { usePostStore } from "../stores/usePostStore";
import { useProfileStore } from "../stores/useProfileStore";

import {api} from "@/api/";

const Feed: React.FC = () => {
  const theme = useTheme();
  const posts = usePostStore((state) => state.posts);
  const fetchNewsFeed = usePostStore((state) => state.fetchNewsFeedFromAPI);
  const { userData, setUserData } = useProfileStore();

  const visiblePosts = posts.filter((post) => post.isUserPost !== true);

  useEffect(() => {
    fetchNewsFeed();
  
    // ✅ Fetch user data if not already fetched
    if (!userData) {
      api.user.getLocalUserProfile().then(setUserData).catch(console.error);
    }
  }, []);

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
          {userData ? (
            <>
              <ProfileCard />
              <ConnectionsCard />
              <SalesNavCard />
              <QuickLinksCard />
            </>
          ) : (
            <CircularProgress />
          )}
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
            <CreatePost />
          </Box>

          {visiblePosts.map((post) => (
            <Box key={post.id} sx={{ width: "100%", maxWidth: "600px" }}>
              <ConnectionPost post={post} />
            </Box>
          ))}
        </Box>

        {/* Right Panel */}
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
          <JobsCard />
          <Footer />
        </Box>
      </Container>
    </Box>
  );
};

export default Feed;
