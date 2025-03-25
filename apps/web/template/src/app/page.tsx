"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProfileCard from "./components/ProfileCard";
import NotificationCard from "./components/NotificationCard";
import SettingsCard from "./components/SettingsCard";
import Footer from "./components/Footer";
import { Box, Container, CircularProgress } from "@mui/material";
import { useNotificationStore } from "./store/useNotificationStore";
import { useProfileStore } from "./store/useProfileStore";

export default function Home() {
  const { userData, setUserData } = useProfileStore();
  const { setNotifications } = useNotificationStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user");
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notifications");
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();

        const deletedIds = JSON.parse(localStorage.getItem("deletedNotifications") || "[]");
        const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");

        const mergedNotifications = data
          .filter((notif: any) => !deletedIds.includes(notif.id))
          .map((notif: any) => {
            const storedNotif = storedNotifications.find((n: any) => n.id === notif.id);
            return storedNotif ? { ...notif, markedasread: storedNotif.markedasread } : notif;
          });

        setNotifications(mergedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUserData();
    fetchNotifications();
  }, [setUserData, setNotifications]);

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
