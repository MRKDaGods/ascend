"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Divider, Avatar, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const SigninBox = () => {
  const router = useRouter();

  return (
    <Box textAlign="center" mt={4} sx={{ position: "relative" }}>
      {/* Welcome Text */}
      <Typography variant="h5" fontWeight="bold" color="text.primary" id="welcome-text">
        Welcome Back
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1} mb={3} id="description-text">
        Don’t miss your next opportunity. Sign in to stay updated on your professional world.
      </Typography>

      {/* Sign-in Box */}
      <Box
        sx={{
          width: 360,
          border: "1px solid #ccc",
          borderRadius: 0,
          overflow: "hidden",
          mx: "auto",
          backgroundColor: "white",
        }}
      >
        {/* User Account Box */}
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between"
          sx={{ cursor: "pointer", "&:hover": { bgcolor: "grey.100" } }}
          p={2}
        >
          <Box display="flex" alignItems="center">
            <Avatar src="/user.jpg" sx={{ width: 40, height: 40, mr: 2 }} />
            <Box textAlign="left">
              <Typography fontWeight="bold" id="user-name">Mehrati Sameh</Typography>
              <Typography variant="body2" color="text.secondary" id="user-email">
                m*****@gmail.com
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Sign in with another account */}
        <Box 
          display="flex" 
          alignItems="center" 
          justifyContent="flex-start"
          p={2} 
          sx={{ cursor: "pointer", "&:hover": { bgcolor: "grey.100" } }}
          onClick={() => router.push("/authen/signup")}
          id="sign-in-another-account-button"
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: "grey.300", mr: 2 }} />
          <Typography variant="body2" color="text.primary">
            Sign in using another account
          </Typography>
        </Box>
      </Box>

      {/* Join Now Link */}
      <Typography variant="body2" color="text.secondary" mt={3}>
        New to LinkedIn?{" "}
        <Typography 
          component="span" 
          color="primary" 
          fontWeight="bold" 
          sx={{ cursor: "pointer" }}
          onClick={() => router.push("/authen/NewToLinkedin")}
          id="join-now-link"
        >
          Join now
        </Typography>
      </Typography>
    </Box>
  );
};

export default SigninBox;
