"use client";

import { useEffect } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import NotificationCard from "../components/NotificationCard";
import SettingsCard from "../components/SettingsCard";
import Footer from "@/components/Footer";
import { Box, Container, CircularProgress } from "@mui/material";
import { useNotificationStore } from "../store/useNotificationStore";
import { useProfileStore } from "../store/useProfileStore";

export default function Home() {
  const { userData, setUserData } = useProfileStore();
  const { setNotifications } = useNotificationStore();

  useEffect(() => {
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
    
        //  Filter out deleted notifications before setting state
        const storedNotifications = localStorage.getItem("notifications");
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          const filteredNotifications = data.filter((notif: any) =>
            parsedNotifications.some((n: any) => n.id === notif.id)
          );
    
          setNotifications(filteredNotifications);
        } else {
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    

    fetchUserData();
    fetchNotifications();
  }, [setUserData, setNotifications]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <Container sx={{ flexGrow: 1, mt: 10, display: "flex", gap: 3, maxWidth: "1200px", pb: 3 }}>
        <Box sx={{ width: "250px", display: "flex", flexDirection: "column", gap: 2 }}>
          {userData ? <ProfileCard /> : <CircularProgress />}
          <SettingsCard />
        </Box>

        <Box sx={{ flexGrow: 1, maxWidth: "750px" }}>
          <NotificationCard />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}