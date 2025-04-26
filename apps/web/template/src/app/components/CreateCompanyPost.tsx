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
import { useCompanyPostStore } from "../stores/useCompanyPostStore";
import AddCompanyMedia from "./AddCompanyMedia";
import CompanyPostPopup from "./CompanyPostPopup";
import CreateCompanyPostDialog from "./CreateCompanyPostDialog";
import CompanyDraftSavedPopup from "./CompanyDraftSavedPopup";
import RepostCompanyPopup from "./RepostCompanyPopup";

const CreateCompanyPost: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { open, setOpen, draftText } = useCompanyPostStore();

  return (
    <div>
      <Box
        component="section"
        sx={{
          p: 2,
          mb: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          width: "100%",
          maxWidth: "600px",
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2,
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
            src={"man.jpg"} //dummyprofile pic
            sx={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48 }}
          >
          </Avatar>

          <Box
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

        <Box sx={{ mt: 2, width: "100%" }}>
          <AddCompanyMedia />
        </Box>
      </Box>

      {/* Popups */}
      {typeof window !== "undefined" && open && <CreateCompanyPostDialog />}
      <CompanyDraftSavedPopup />
      <CompanyPostPopup />
      <RepostCompanyPopup />
    </div>
  );
};

export default CreateCompanyPost;
