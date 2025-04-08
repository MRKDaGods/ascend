"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, Typography, Box, Avatar, Skeleton, Alert } from "@mui/material";
import { useProfileStore } from "../store/useProfileStore";

const ProfileCard: React.FC = () => {
  const { userData, setUserData } = useProfileStore();
  const [isLoading, setIsLoading] = useState(!userData); // Only load if no data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!userData) {
      fetchUserData();
    }
  }, [userData, setUserData]);

  const profileImg = userData?.profilePhoto || "/default-avatar.jpg";
  const coverImg = userData?.coverPhoto || "/default-cover.jpg";
  const isOpenToWork = userData?.opentowork;

  return (
    <Link href="/profile" style={{ textDecoration: "none", color: "inherit" }}>
      <Card
        sx={{
          maxWidth: 300,
          width: "100%",
          minHeight: 180,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 3,
          backgroundColor: "white",
          mt: 2,
        }}
      >
        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ width: "100%", height: 120, position: "relative" }}>
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={120} />
          ) : (
            <img
              src={coverImg}
              alt="Cover Image"
              style={{ width: "100%", height: "50%", objectFit: "cover" }}
              onError={(e) => ((e.target as HTMLImageElement).src = "/default-cover.jpg")}
            />
          )}
        </Box>

        <CardContent sx={{ textAlign: "left", position: "relative", mt: -6, px: 2 }}>
          {isLoading ? (
            <Skeleton variant="circular" width={80} height={80} sx={{ mt: -5 }} />
          ) : (
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={profileImg}
                alt={userData?.name || "User"}
                sx={{ width: 80, height: 80, border: "3px solid white", mt: -5 }}
                onError={(e) => ((e.target as HTMLImageElement).src = "/default-avatar.jpg")}
              />
              {isOpenToWork && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -5,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#008000",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    padding: "4px 10px",
                    whiteSpace: "nowrap",
                    boxShadow: "0px 0px 10px rgba(0, 128, 0, 0.8)",
                    textAlign: "center",
                  }}
                >
                  Open to Work
                </Box>
              )}
            </Box>
          )}

          {isLoading ? (
            <>
              <Skeleton width="60%" sx={{ mt: 2 }} />
              <Skeleton width="80%" sx={{ mt: 1 }} />
              <Skeleton width="50%" sx={{ mt: 1 }} />
            </>
          ) : (
            userData && (
              <>
                <Typography variant="h6" fontWeight={600} sx={{ mt: 1, color: "black" }}>
                  {userData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.role} at {userData.entity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.location}
                </Typography>
              </>
            )
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProfileCard;
