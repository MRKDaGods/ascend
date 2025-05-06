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

const UserPostsPage: React.FC = () => {
  const theme = useTheme();
  const userPosts = usePostStore((state) => state.userPosts);
  const fetchUserPostsFromAPI = usePostStore((state) => state.fetchUserPostsFromAPI);
  const { userData, setUserData } = useProfileStore();

  useEffect(() => {
    const loadUserDataAndPosts = async () => {
      try {
        let profile = userData;
        if (!profile) {
          profile = await api.user.getLocalUserProfile();
          setUserData(profile);
        }

        const userId = profile?.user_id;

        if (userId) {
          await fetchUserPostsFromAPI(userId);
        } else {
          console.warn("❌ User ID not found in profile:", profile);
        }
      } catch (error) {
        console.error("❌ Failed to load user posts:", error);
      }
    };

    loadUserDataAndPosts();
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

          {userPosts.length === 0 ? (
            <Typography sx={{ mt: 2, color: theme.palette.text.secondary }}>
              You haven't posted anything yet.
            </Typography>
          ) : (
            userPosts.map((post) => (
              <Box key={post.id} sx={{ width: "100%", maxWidth: "600px" }}>
                {post.isReported ? (
                  <FeedbackAcknowledgement />
                ) : (
                  <UserPost post={post} />
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

export default UserPostsPage;
