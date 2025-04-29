import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Palette,
  Paper,
} from "@mui/material";
import { CoverPhoto } from "./CoverPhoto";
import { ProfilePhoto } from "./ProfilePhoto";
import { useState } from "react";
import { ProfileInfo } from "./ProfileInfo";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InterestsIcon from "@mui/icons-material/Interests";
import SchoolIcon from "@mui/icons-material/School";
import BuildIcon from "@mui/icons-material/Build";
import WorkIcon from "@mui/icons-material/Work";
import InfoIcon from "@mui/icons-material/Info";
import { Experience, Profile } from "@ascend/api-client/models";

interface ProfileSummarySectionProps {
  isEditable: boolean;
  profile: Profile;
  palette: Palette;
  setContactInfoAnchor: (anchor: HTMLElement | null) => void;
  setPremiumDialogOpen: (open: boolean) => void;
  sortExperiencesByDate: (experiences: Experience[]) => Experience[];
  handleEditDialogOpen: (
    sectionType:
      | "profile"
      | "experience"
      | "education"
      | "project"
      | "course"
      | "skill"
      | "interest"
  ) => void;
  setImageDialogType: (type: "profile" | "cover") => void;
  setViewImageUrl: (url: string) => void;
  setProfileInfoOpen: (open: boolean) => void;
}

export const ProfileSummarySection = ({
  isEditable,
  profile,
  palette,
  setContactInfoAnchor,
  setPremiumDialogOpen,
  sortExperiencesByDate,
  handleEditDialogOpen,
  setImageDialogType,
  setViewImageUrl,
  setProfileInfoOpen,
}: ProfileSummarySectionProps) => {
  const [resourcesMenuAnchor, setResourcesMenuAnchor] =
    useState<null | HTMLElement>(null);

  const [sectionMenuAnchor, setSectionMenuAnchor] =
    useState<null | HTMLElement>(null);

  const handleContactInfoOpen = (event: React.MouseEvent<HTMLElement>) => {
    setContactInfoAnchor(event.currentTarget);
  };

  const handleProfileInfoOpen = () => {
    setProfileInfoOpen(true);
    handleResourcesClose();
  };

  const handleOpenToClick = () => {
    console.log("Open to clicked");
  };

  const handleEnhanceProfileClick = () => {
    setPremiumDialogOpen(true);
  };

  const handleResourcesClick = (event: React.MouseEvent<HTMLElement>) => {
    setResourcesMenuAnchor(event.currentTarget);
  };

  const handleResourcesClose = () => {
    setResourcesMenuAnchor(null);
  };

  const handleAddSection = (
    sectionType:
      | "experience"
      | "education"
      | "skill"
      | "project"
      | "course"
      | "interest"
  ) => {
    handleEditDialogOpen(sectionType);
    handleSectionMenuClose();
  };

  const handleSectionMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSectionMenuAnchor(event.currentTarget);
  };

  const handleSectionMenuClose = () => {
    setSectionMenuAnchor(null);
  };

  // Handle image dialog open
  const handleImageDialogOpen = (type: "profile" | "cover") => {
    setImageDialogType(type);
  };

  const handleViewImage = (url: string) => {
    setViewImageUrl(url);
  };

  return (
    <Paper
      sx={{
        position: "relative",
        mb: 4,
        bgcolor: "background.paper",
      }}
    >
      {/* Cover */}
      <CoverPhoto
        profile={profile}
        isEditable={isEditable}
        handleImageDialogOpen={handleImageDialogOpen}
        handleViewImage={handleViewImage}
      />

      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            mb: 2,
          }}
        >
          {/* Profile Picture */}
          <ProfilePhoto
            isEditable={isEditable}
            profile={profile}
            handleImageDialogOpen={handleImageDialogOpen}
            palette={palette}
            handleViewImage={handleViewImage}
          />

          {/* Profile Info */}
          <ProfileInfo
            profile={profile}
            handleContactInfoOpen={handleContactInfoOpen}
            isEditable={isEditable}
            sortExperiencesByDate={sortExperiencesByDate}
          />
        </Box>

        {isEditable && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon fontSize="small" />}
            sx={{
              position: "absolute",
              top: { xs: 230, md: 220 },
              right: { xs: 16, md: 16 },
              zIndex: 10,
              borderRadius: "28px",
              textTransform: "none",
              fontWeight: 600,
              border: `1px solid ${
                palette.mode === "dark"
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(0,0,0,0.6)"
              }`,
              color: "text.primary",
              bgcolor: "background.paper",
              boxShadow: 1,
              p: "6px 12px",
              "&:hover": {
                backgroundColor: "action.hover",
                borderColor:
                  palette.mode === "dark"
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(0,0,0,0.8)",
              },
            }}
            onClick={() => handleEditDialogOpen("profile")}
          >
            Edit profile
          </Button>
        )}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            mt: 2,
          }}
        >
          {isEditable && (
            <>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "28px",
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                onClick={handleOpenToClick}
              >
                Open to
              </Button>

              <Button
                id="profile-section-button"
                variant="outlined"
                onClick={handleSectionMenuOpen}
                endIcon={<ExpandMoreIcon />}
                aria-controls={
                  Boolean(sectionMenuAnchor)
                    ? "profile-section-menu"
                    : undefined
                }
                sx={{
                  borderRadius: "28px",
                  textTransform: "none",
                  fontWeight: 600,
                  border: `1px solid ${
                    palette.mode === "dark"
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.6)"
                  }`,
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    borderColor:
                      palette.mode === "dark"
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(0,0,0,0.8)",
                  },
                }}
              >
                Add profile section
              </Button>

              <Menu
                id="profile-section-menu"
                anchorEl={sectionMenuAnchor}
                open={Boolean(sectionMenuAnchor)}
                onClose={handleSectionMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: { minWidth: 200 },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={() => handleAddSection("experience")}>
                  <ListItemIcon>
                    <WorkIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Position" />
                </MenuItem>
                <MenuItem onClick={() => handleAddSection("education")}>
                  <ListItemIcon>
                    <SchoolIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Education" />
                </MenuItem>
                <MenuItem onClick={() => handleAddSection("skill")}>
                  <ListItemIcon>
                    <BuildIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Skill" />
                </MenuItem>
                <MenuItem onClick={() => handleAddSection("project")}>
                  <ListItemIcon>
                    <InterestsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Project" />
                </MenuItem>
                <MenuItem onClick={() => handleAddSection("course")}>
                  <ListItemIcon>
                    <SchoolIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Course" />
                </MenuItem>
                <MenuItem onClick={() => handleAddSection("interest")}>
                  <ListItemIcon>
                    <InterestsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Interest" />
                </MenuItem>
              </Menu>

              <Button
                variant="outlined"
                sx={{
                  borderRadius: "28px",
                  textTransform: "none",
                  fontWeight: 600,
                  border: `1px solid ${
                    palette.mode === "dark"
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.6)"
                  }`,
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    borderColor:
                      palette.mode === "dark"
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(0,0,0,0.8)",
                  },
                }}
                onClick={handleEnhanceProfileClick}
              >
                Enhance profile
              </Button>

              <Button
                variant="text"
                endIcon={<ExpandMoreIcon />}
                sx={{
                  borderRadius: "28px",
                  textTransform: "none",
                  fontWeight: 600,
                  color: "text.primary",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
                onClick={handleResourcesClick}
              >
                Resources
              </Button>

              <Menu
                anchorEl={resourcesMenuAnchor}
                open={Boolean(resourcesMenuAnchor)}
                onClose={handleResourcesClose}
                PaperProps={{
                  elevation: 3,
                  sx: { minWidth: 200 },
                }}
              >
                <MenuItem onClick={handleProfileInfoOpen}>
                  <ListItemIcon>
                    <InfoIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="About this profile" />
                </MenuItem>
                <MenuItem onClick={handleResourcesClose}>
                  <ListItemIcon>
                    <WorkIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Find a career coach" />
                </MenuItem>
                <MenuItem onClick={handleResourcesClose}>
                  <ListItemIcon>
                    <SchoolIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Learning resources" />
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
