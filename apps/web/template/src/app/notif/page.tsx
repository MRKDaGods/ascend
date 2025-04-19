"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import ProfileCard from "@/app/components/ProfileCard";
import NotificationCard from "@/app/components/NotificationCard";
import SettingsCard from "@/app/components/SettingsCard";
import Footer from "@/app/components/Footer";
import { Box, Container, CircularProgress } from "@mui/material";
import { useNotificationStore } from "../stores/useNotificationStore";
import { useProfileStore } from "../stores/useProfileStore";
import { api } from "@/api";

export default function Home() {
  const { userData, setUserData } = useProfileStore();
  const { setNotifications } = useNotificationStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Fake login 3shn nhave any notifs

    // const fetchUserData = async () => {
    //   try {
    //     const response = await fetch("http://localhost:5000/api/user");
    //     if (!response.ok) throw new Error("Failed to fetch user data");
    //     const data = await response.json();
    //     setUserData(data);
    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
    // };

    const fetchNotifications = async () => {
      api.auth.login("ammar@ascendx.tech", "123").then((response) => {
        console.log("Login response:", response);

        // Set the user data in the store
        api.user.getLocalUserProfile().then((user) => {
          console.log("Fetched user data:", user);
          setUserData(user);
        });

        api.notification.getNotifications(1) // Page number 1 for the latest 10 notifications
          .then((response) => {
            console.log("Fetched notifications:", response);
            setNotifications(response);
          })
          .catch((error) => {
            console.error("Error fetching notifications:", error);
          });
      }).catch((error) => {
        console.error("Login error:", error);
      }
      );
    };

    setIsClient(true);

    //fetchUserData();
    fetchNotifications();
  }, []);

  if (!isClient) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      {/* Main Layout */}
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
        {/* Profile & Settings Cards - Sticky on Large Screens, Stacked on Mobile */}
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

        {/* Notification Card - Fully Visible on Small Screens */}
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: { xs: "100%", md: "750px" },
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "visible",
          }}
        >
          <NotificationCard />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}