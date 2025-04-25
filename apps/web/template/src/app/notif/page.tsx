"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles"; // ✅ useTheme for dynamic colors
import {
  Box,
  Container,
  CircularProgress,
} from "@mui/material";

import Navbar from "@/app/components/Navbar";
import ProfileCard from "@/app/components/ProfileCard";
import NotificationCard from "@/app/components/NotificationCard";
import SettingsCard from "@/app/components/SettingsCard";
import Footer from "@/app/components/Footer";

import { useNotificationStore } from "../stores/useNotificationStore";
import { useProfileStore } from "../stores/useProfileStore";
import { api } from "@/api";

export default function Home() {
  const theme = useTheme();
  const { userData, setUserData } = useProfileStore();
  const { setNotifications } = useNotificationStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      api.user.getLocalUserProfile().then((user) => {
        console.log("Fetched user data:", user);
        setUserData(user);
      });

      api.notification
        .getNotifications(1)
        .then((response) => {
          console.log("Fetched notifications:", response);
          setNotifications(response);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    };

    setIsClient(true);
    fetchNotifications();
  }, []);

  if (!isClient) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default, // ✅ Theme-aware background
        display: "flex",
        flexDirection: "column",
        color: theme.palette.text.primary, // optional if needed globally
      }}
    >
      <Navbar />

      <Container
        sx={{
          flexGrow: 1,
          mt: 10,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          maxWidth: "1200px",
          pb: 3,
        }}
      >
        {/* Left Panel */}
        <Box
          sx={{
            width: { xs: "100%", md: "250px" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: { md: "sticky" },
            top: { md: "80px" },
            height: "fit-content",
          }}
        >
          {userData ? <ProfileCard /> : <CircularProgress />}
          <Box sx={{ width: "100%" }}>
            <SettingsCard />
          </Box>
        </Box>

        {/* Main Panel */}
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: { xs: "100%", md: "750px" },
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <NotificationCard />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
