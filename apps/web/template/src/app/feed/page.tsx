// Page: Main Feed

"use client";

import React, { useEffect } from "react";
import { Box, Container, CircularProgress, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Navbar from "../components/Navbar";
import CreatePost from "../components/CreatePost";
import ConnectionPost from "../components/ConnectionPost";
import FeedbackAcknowledgement from "../components/FeedbackAcknowledgement";
import ProfileCard from "../components/ProfileCard";
import WhosHiringCard from "../components/WhosHiringCard";
import Footer from "../components/Footer";
import TryPremCard from "../components/TryPremCard";
import ManageFeedCard from "../components/ManageFeedCard";
import SidebarPreview from "../components/SidebarPreview";

import { usePostStore } from "../stores/usePostStore";
import { useProfileStore } from "../stores/useProfileStore";

import { api } from "@/api/";

const Feed: React.FC = () => {
  const theme = useTheme();
  const posts = usePostStore((state) => state.posts);
  const fetchNewsFeed = usePostStore((state) => state.fetchNewsFeedFromAPI);
  const { userData, setUserData } = useProfileStore();

  const visiblePosts = posts.filter((post) => post.isUserPost !== true);

  useEffect(() => {
    fetchNewsFeed();

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
      <SidebarPreview />

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
              <ManageFeedCard />
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

          <Divider
            sx={{
              borderColor: theme.palette.divider,
              borderWidth: "1px",
              width: "100%",
              maxWidth: "600px",
            }}
          />

          {visiblePosts.length === 0 ? (
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              Connect with Ascend users to display their posts here!
            </Typography>
          ) : (
            visiblePosts.map((post) => (
              <Box key={post.id} sx={{ width: "100%", maxWidth: "600px" }}>
                {post.isReported ? (
                  <FeedbackAcknowledgement />
                ) : (
                  <ConnectionPost post={post} />
                )}
              </Box>
            ))
          )}
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
          <WhosHiringCard />
          <TryPremCard />
          <Footer />
        </Box>
      </Container>
    </Box>
  );
};

export default Feed;
