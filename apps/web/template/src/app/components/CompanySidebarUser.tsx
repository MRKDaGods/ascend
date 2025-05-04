"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  List,
  ListItem,
  Avatar,
  useTheme,
} from "@mui/material";
import CreateDialog from "./CreateDialog";
import { useCompanyStore } from "@/app/stores/useCreateCompanyStore";
import { useNavigationStore } from "@/app/stores/useNavigationStore";
import Cookies from "js-cookie";

export default function CompanySidebarUser() {
  const theme = useTheme();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    name,
    profileImage,
    coverImage,
    setCompanyInfo,
    followerCounts,
    followingStatus,
    toggleFollowCompany,
    fetchCompanyFollowers,
  } = useCompanyStore();

  const userId = Cookies.get("linkup_user_id");
  const companyId = Number(localStorage.getItem("companyId"));

  const { activePage, setActivePage } = useNavigationStore();

  useEffect(() => {
    if (companyId && userId) {
      fetchCompanyFollowers(companyId, Number(userId));
    }
  }, [companyId, userId]);

  return (
    <>
      <Box
        id="company-sidebar-user"
        sx={{
          width: 350,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          p: 2,
          ml: 3,
          borderRadius: 2,
          mb: 2,
          mt: 2,
          boxShadow: theme.shadows[2],
        }}
      >
        {/* Cover Image */}
        <Box
          id="company-sidebar-user-cover"
          sx={{
            position: "relative",
            height: 100,
            borderRadius: 2,
            overflow: "hidden",
            mb: 3,
            backgroundImage: `url(${
              coverImage || "https://via.placeholder.com/325x100?text=Cover"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Avatar */}
        <Box
          id="company-sidebar-user-avatar"
          sx={{ position: "relative", mt: -7, mb: 2, zIndex: 3 }}
        >
          <Avatar
            id="company-avatar"
            src={profileImage || undefined}
            sx={{
              width: 64,
              height: 64,
              border: `2px solid ${theme.palette.background.paper}`,
              backgroundColor: theme.palette.grey[300],
            }}
          />
        </Box>

        {/* Name and Followers */}
        <Typography id="company-name" fontWeight={600} fontSize={25}>
          {name || "Company Name"}
        </Typography>
        <Typography
          id="company-followers"
          variant="body2"
          color="text.secondary"
        >
          {followerCounts[companyId] ?? 0} followers
        </Typography>

        {/* Follow Button */}
        <Button
          id="follow-button"
          variant="contained"
          size="small"
          onClick={() => toggleFollowCompany(companyId, Number(userId))}
          sx={{ mt: 1, textTransform: "none", fontWeight: 500 }}
        >
          {followingStatus[companyId] ? "Unfollow" : "Follow"}
        </Button>

        <Divider id="sidebar-divider" sx={{ my: 2 }} />

        {/* Sidebar Navigation */}
        <List id="sidebar-navigation">
          {["Feed", "Company jobs"].map((item) => (
            <ListItem
              key={item}
              id={`sidebar-item-${item.toLowerCase()}`}
              sx={{ py: 1 }}
            >
              <Button
                id={`sidebar-button-${item.toLowerCase()}`}
                fullWidth
                variant={activePage === item ? "contained" : "text"}
                onClick={() => setActivePage(item)}
                sx={{
                  textAlign: "left",
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "1.2rem",
                  bgcolor:
                    activePage === item
                      ? theme.palette.action.selected
                      : "transparent",
                  color: theme.palette.text.primary,
                  "&:hover": {
                    bgcolor:
                      activePage === item
                        ? theme.palette.action.hover
                        : theme.palette.action.hover,
                  },
                }}
              >
                {item}
              </Button>
            </ListItem>
          ))}
        </List>

        <CreateDialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
        />
      </Box>
    </>
  );
}
