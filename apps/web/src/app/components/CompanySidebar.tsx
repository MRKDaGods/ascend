"use client";

import { useState, useRef } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  List,
  ListItem,
  Avatar,
  IconButton,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CreateDialog from "./CreateDialog";
import EditPageModal from "./EditPageModal";
import { useRouter } from "next/navigation";
import { useCompanyStore } from "@/app/stores/useCreateCompanyStore";
import { useNavigationStore } from "@/app/stores/useNavigationStore";

export default function Sidebar() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const theme = useTheme(); // ✅ Use theme

  const { companyId, name, profileImage, coverImage, setCompanyInfo } = useCompanyStore();
  const { activePage, setActivePage } = useNavigationStore();

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyInfo({ coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Box
        id="company-sidebar"
        sx={{
          width: 350,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          p: 2,
          ml: 25,
          borderRadius: 2,
          mb: 2,
          mt: 2,
          boxShadow: theme.shadows[1],
        }}
      >
        {/* Cover */}
        <Box
          id="company-sidebar-cover"
          sx={{
            position: "relative",
            height: 100,
            borderRadius: 2,
            overflow: "hidden",
            mb: 3,
            backgroundImage: `url(${coverImage || "https://via.placeholder.com/325x100?text=Cover"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <IconButton
            id="edit-cover-button"
            size="small"
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
              zIndex: 2,
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <input
            id="cover-image-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleCoverImageChange}
          />
        </Box>

        {/* Avatar */}
        <Box id="company-sidebar-avatar" sx={{ position: "relative", mt: -7, mb: 2, zIndex: 3 }}>
          <Avatar
            id="company-avatar"
            src={profileImage || undefined}
            sx={{
              width: 64,
              height: 64,
              border: `5px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.grey[300],
            }}
          />
        </Box>

        {/* Name + Buttons */}
        <Typography id="company-name" fontWeight="600" fontSize={25}>
          {name || "Company Name"}
        </Typography>

        <Divider id="sidebar-divider" sx={{ my: 2 }} />

        {/* Navigation Buttons */}
        <List id="sidebar-navigation">
          {["Dashboard", "Page posts", "Analytics", "Feed", "Edit page", "Jobs", "Deactivate Page"].map((item) => {
            const isActive = activePage === item;
            return (
              <ListItem key={item} sx={{ py: 1 }}>
                <Button
                  fullWidth
                  variant={isActive ? "contained" : "text"}
                  onClick={() => {
                    setActivePage(item);
                    if (item === "Edit page") setShowEditModal(true);
                    else if (item === "Jobs") router.push("/jobs/PostJob");
                  }}
                  sx={{
                    textAlign: "left",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    fontWeight: "500",
                    fontSize: "1.2rem",
                    bgcolor: isActive ? theme.palette.action.selected : "transparent",
                    color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
                    "&:hover": {
                      bgcolor: isActive ? theme.palette.action.hover : theme.palette.action.hover,
                    },
                  }}
                >
                  {item}
                </Button>
              </ListItem>
            );
          })}
        </List>

        <CreateDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} />
      </Box>

      <EditPageModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={() => setShowEditModal(false)}
      />
    </>
  );
}
