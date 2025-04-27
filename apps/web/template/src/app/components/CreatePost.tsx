// Component file: where the user is prompted to create a post "start a post"

"use client";

import React from "react";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { usePostStore } from "../stores/usePostStore";
import { useProfileStore } from "../stores/useProfileStore";
import AddMedia from "./AddMedia";
import UserPostPopup from "./UserPostPopup";
import CreatePostDialog from "./CreatePostDialog";
import DraftSavedPopup from "./DraftSavedPopup";
import RepostPopup from "./RepostPopup";

const CreatePost: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { open, setOpen, draftText } = usePostStore();
  
  type Profile = {
    profile_picture_url?: string;
    first_name: string;
    last_name: string;
  };  
  
  const userData = useProfileStore((state) => state.userData) as Profile | null;
  const profilePicture = userData?.profile_picture_url || "/default-avatar.png"; //❌ Fallback
  const fullName = userData ? `${userData.first_name} ${userData.last_name}` : "User";

  return (
    <div>
      <Box
        component="section"
        sx={{
          p: 2,
          mb: 0.01,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          width: "100%",
          maxWidth: "600px",
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mx: "auto",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ width: "100%", px: 1 }}
        >
          <Avatar
            alt={fullName}
            src={profilePicture}
            sx={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48 }}
          >
            {fullName.charAt(0)}
          </Avatar>

          <Box
            id="start-post-button" // ✅ ID added
            sx={{
              flexGrow: 1,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 50,
              backgroundColor: theme.palette.background.paper,
              px: 2,
              py: 1.5,
              cursor: "pointer",
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
            onClick={() => setOpen(true)}
          >
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: isMobile ? "13px" : "14px",
                fontWeight: "bold",
              }}
            >
              {draftText ? `Draft: ${draftText}` : "Start a post"}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mt: 0.1, width: "100%" }}>
          <AddMedia />
        </Box>
      </Box>

      {/* Popups */}
      {typeof window !== "undefined" && open && <CreatePostDialog />}
      <DraftSavedPopup />
      <UserPostPopup />
      <RepostPopup />
    </div>
  );
};

export default CreatePost;
