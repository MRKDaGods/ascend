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
import { api, extApi } from "@/api";

export default function Home() {
  const theme = useTheme();
  const { userData, setUserData } = useProfileStore();
  const { setNotifications } = useNotificationStore();

  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const PAGE_LIMIT = 10;

  const fetchNotificationsPage = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await extApi.get(`/notifications/?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      if (!(response.status === 200)) {
        throw new Error(`Error fetching notifications: ${response.statusText}`);
      }
      
      const data = await response.data;
      console.log(`Fetched notifications for page ${page}:`, data);
      
      // If we received fewer notifications than the limit, we've reached the end
      if (data.length < PAGE_LIMIT) {
        setHasMorePages(false);
      }
      
      // If it's the first page, replace notifications, otherwise append
      if (page === 1) {
        setNotifications(data);
      } else {
        setNotifications(prev => [...prev, ...data]);
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreNotifications = () => {
    if (!isLoading && hasMorePages) {
      const nextPage = currentPage + 1;
      fetchNotificationsPage(nextPage);
      setCurrentPage(nextPage);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch user profile data
      api.user.getLocalUserProfile().then((user) => {
        console.log("Fetched user data:", user);
        setUserData(user);

        fetchNotificationsPage(1);
      });
    };

    setIsClient(true);
    fetchInitialData();
  }, [setUserData, setNotifications]);

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
          mt: 6, // Changed from 10 to 2 to match other pages
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 7,
          maxWidth: "1200px",
          pb: 3,
          px: { xs: 1, sm: 2 }, // Added consistent padding
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
            alignSelf: "flex-start", // Added to ensure consistent alignment
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
            mt: { xs: 0, md: 0 }, // Reset any margin
          }}
        >
          <NotificationCard />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
