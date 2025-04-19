"use client";

import { Card, CardContent, Typography, Box, Avatar, Skeleton, Alert } from "@mui/material";
import Link from "next/link";
import { useProfileStore } from "../stores/useProfileStore";
import { Profile } from "@ascend/api-client/models";

const ProfileCard: React.FC = () => {
  const userData = useProfileStore((state) => state.userData) as Profile | null;
  const isLoading = !userData;
  const error = null;

  const profileImg = userData?.profile_picture_url || "/default-avatar.jpg";
  const coverImg = userData?.cover_photo_url || "/default-cover.jpg";
  const fullName = userData ? `${userData.first_name} ${userData.last_name}` : "";
  
  const isOpenToWork = true; // TODO: ??
  
  // Get current company and role from the most recent experience
  const currentExperience = userData?.experience?.sort((a, b) => {
    const dateA = a.end_date ? new Date(a.end_date) : new Date();
    const dateB = b.end_date ? new Date(b.end_date) : new Date();
    return dateB.getTime() - dateA.getTime();
  })[0];
  
  const currentRole = currentExperience?.position;
  const currentCompany = currentExperience?.company;

  return (
    <Link href="/profile" style={{ textDecoration: "none", color: "inherit" }}>
      <Card
        sx={{
          maxWidth: 250,
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

        {/* Cover Photo */}
        <Box sx={{ width: "100%", height: 120, position: "relative" }}>
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={120} />
          ) : (
            <img src={coverImg} alt="Cover Image" style={{ width: "100%", height: "50%", objectFit: "cover" }} />
          )}
        </Box>

        {/* Profile Section */}
        <CardContent sx={{ textAlign: "left", position: "relative", mt: -6, px: 2 }}>
          {isLoading ? (
            <Skeleton variant="circular" width={80} height={80} sx={{ mt: -5 }} />
          ) : (
            <Box sx={{ position: "relative", display: "inline-block" }}>
              {/* Profile Avatar */}
              <Avatar
                src={profileImg}
                alt={fullName || "User"}
                sx={{ width: 80, height: 80, border: "3px solid white", mt: -5 }}
              />

              {/* "Open to Work" Badge with Green Shadow */}
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
                    boxShadow: "0px 0px 10px rgba(0, 128, 0, 0.8)", // Green glow effect
                    textAlign: "center",
                  }}
                >
                  Open to Work
                </Box>
              )}
            </Box>
          )}

          {/* Profile Info */}
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
                  {fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentRole && currentCompany ? `${currentRole} at ${currentCompany}` : "No current position"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.location || "No location specified"}
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