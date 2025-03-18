"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, Typography, Box, Avatar, Skeleton, Alert } from "@mui/material";

interface UserProfile {
  name: string;
  role: string;
  location: string;
  profilePhoto: string;
  coverPhoto: string;
  entity: string;
  entityLink: string;
}

const ProfileCard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback images
  const [profileImg, setProfileImg] = useState("/default-avatar.jpg");
  const [coverImg, setCoverImg] = useState("/default-cover.jpg");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data: UserProfile = await response.json();
        setUser(data);

        // Set user images if available
        if (data.profilePhoto) setProfileImg(data.profilePhoto);
        if (data.coverPhoto) setCoverImg(data.coverPhoto);
      } catch (error) {
        setError("Failed to fetch user data. Please try again.");
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Link href="/profile" style={{ textDecoration: "none", color: "inherit" }}>
     <Card
  sx={{
    width: 300, // Fixed width
    minHeight: 180, // Ensures it never gets cut
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: 3,
    backgroundColor: "white",
  }}
>


        {error && <Alert severity="error">{error}</Alert>}

        {/* Cover Image */}
        <Box sx={{ width: "100%", height: 120, position: "relative" }}>
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={120} />
          ) : (
            <img
              src={coverImg}
              alt="Cover Image"
              onError={() => setCoverImg("/default-cover.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </Box>

        <CardContent sx={{ textAlign: "left", position: "relative", mt: -6, px: 2 }}>
          {/* Profile Image */}
          {isLoading ? (
            <Skeleton variant="circular" width={80} height={80} sx={{ mt: -5 }} />
          ) : (
            <Avatar
              src={profileImg}
              alt={user?.name || "User"}
              sx={{
                width: 80,
                height: 80,
                border: "3px solid white",
                mt: -5,
              }}
              onError={() => setProfileImg("/default-avatar.jpg")}
            />
          )}

          {/* User Info */}
          {isLoading ? (
            <>
              <Skeleton width="60%" sx={{ mt: 2 }} />
              <Skeleton width="80%" sx={{ mt: 1 }} />
              <Skeleton width="50%" sx={{ mt: 1 }} />
            </>
          ) : (
            user && (
              <>
                {/* Name */}
                <Typography variant="h6" fontWeight={600} sx={{ mt: 1, color: "black" }}>
                  {user.name}
                </Typography>

                {/* Role & Entity in One Line */}
                <Typography variant="body2" color="text.secondary">
                  {user.role} at {user.entity}
                </Typography>

                {/* Location */}
                <Typography variant="body2" color="text.secondary">
                  {user.location}
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
