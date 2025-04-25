"use client";

import { api } from "@/api";
import { Experience, Profile } from "@ascend/api-client/models";
import AddIcon from "@mui/icons-material/Add";
import BuildIcon from "@mui/icons-material/Build";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import InterestsIcon from "@mui/icons-material/Interests";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkIcon from "@mui/icons-material/Work";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card, CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  ListItemIcon, ListItemText,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  TextField,
  Typography
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format as formatDate } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Navbar from "../components/Navbar";

function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>();
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit dialog states
  const [editMode, setEditMode] = useState<'profile' | 'experience' | 'education' | 'project' | 'course' | 'skill' | 'interest' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  // Image dialog state
  const [imageDialogType, setImageDialogType] = useState<'profile' | 'cover' | null>(null);

  // Add profile section menu
  const [sectionMenuAnchor, setSectionMenuAnchor] = useState<null | HTMLElement>(null);
  const [contactInfoAnchor, setContactInfoAnchor] = useState<null | HTMLElement>(null);

  // Add states for premium popup and resources menu
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [resourcesMenuAnchor, setResourcesMenuAnchor] = useState<null | HTMLElement>(null);
  const [profileInfoOpen, setProfileInfoOpen] = useState(false);

  const { palette } = useTheme();

  const profileId = searchParams.get("id");

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const profileIdNumber = parseInt(profileId || "", 10);

      if (profileIdNumber) {
        const data = await api.user.getUserProfile(profileIdNumber);
        setProfile(data);
        setIsEditable(false); // Not editable when viewing someone else's profile
      } else {
        const data = await api.user.getLocalUserProfile();
        setProfile(data);
        setIsEditable(true); // Only editable when viewing our own profile
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  const formatDateHelper = (date: Date | string | undefined) => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDate(dateObj, "MMM yyyy");
  };

  const sortExperiencesByDate = (experiences: Experience[]): Experience[] => {
    return [...experiences].sort((a, b) => {
      const dateA = new Date(a.start_date);
      const dateB = new Date(b.start_date);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const getCurrentPositions = (experiences: Experience[]): Experience[] => {
    return experiences.filter(exp => !exp.end_date);
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

  const handleProfileInfoOpen = () => {
    setProfileInfoOpen(true);
    handleResourcesClose();
  };

  const handleProfileInfoClose = () => {
    setProfileInfoOpen(false);
  };

  const handleContactInfoOpen = (event: React.MouseEvent<HTMLElement>) => {
    setContactInfoAnchor(event.currentTarget);
  };

  const handleContactInfoClose = () => {
    setContactInfoAnchor(null);
  };

  // Handle edit dialog open
  const handleEditDialogOpen = (mode: 'profile' | 'experience' | 'education' | 'project' | 'course' | 'skill' | 'interest', item?: any) => {
    // Prevent editing if not our profile
    if (!isEditable) return;

    setEditMode(mode);
    setEditingItem(item || null);

    if (mode === 'profile') {
      setEditFormData({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        industry: profile?.industry,
        location: profile?.location,
        bio: profile?.bio,
        website: profile?.website,
        additional_name: profile?.additional_name,
        name_pronunciation: profile?.name_pronunciation
      });
    } else if (item) {
      setEditFormData({ ...item });
    } else {
      switch (mode) {
        case 'experience':
          setEditFormData({
            company: "",
            position: "",
            start_date: new Date(),
            description: ""
          });
          break;
        case 'education':
          setEditFormData({
            school: "",
            degree: "",
            field_of_study: "",
            start_date: new Date()
          });
          break;
        case 'project':
          setEditFormData({
            name: "",
            description: "",
            start_date: new Date(),
            url: ""
          });
          break;
        case 'course':
          setEditFormData({
            name: "",
            provider: "",
            completion_date: new Date()
          });
          break;
        case 'skill':
          setEditFormData({
            name: ""
          });
          break;
        case 'interest':
          setEditFormData({
            name: ""
          });
          break;
      }
    }
  };

  // Handle edit dialog close
  const handleEditDialogClose = () => {
    setEditMode(null);
    setEditingItem(null);
    setEditFormData({});
  };

  // Handle form input change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Handle date change
  const handleDateChange = (name: string, date: Date | null) => {
    setEditFormData({
      ...editFormData,
      [name]: date
    });
  };

  // Handle select change
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Handle save profile changes
  const handleSaveChanges = async () => {
    if (!profile) return;

    setIsSubmitting(true);
    try {
      let updatedProfile = { ...profile };

      switch (editMode) {
        case 'profile':
          updatedProfile = {
            ...profile,
            ...editFormData
          };
          break;
        case 'experience':
          const experiences = [...(profile.experience || [])];
          if (editingItem) {
            const index = experiences.findIndex(exp => exp.id === editingItem.id);
            if (index !== -1) {
              experiences[index] = { ...editingItem, ...editFormData };
            }
          } else {
            experiences.push(editFormData);
          }
          updatedProfile.experience = experiences;
          break;
        case 'education':
          const educations = [...(profile.education || [])];
          if (editingItem) {
            const index = educations.findIndex(edu => edu.id === editingItem.id);
            if (index !== -1) {
              educations[index] = { ...editingItem, ...editFormData };
            }
          } else {
            educations.push(editFormData);
          }
          updatedProfile.education = educations;
          break;
        case 'project':
          const projects = [...(profile.projects || [])];
          if (editingItem) {
            const index = projects.findIndex(proj => proj.id === editingItem.id);
            if (index !== -1) {
              projects[index] = { ...editingItem, ...editFormData };
            }
          } else {
            projects.push(editFormData);
          }
          updatedProfile.projects = projects;
          break;
        case 'course':
          const courses = [...(profile.courses || [])];
          if (editingItem) {
            const index = courses.findIndex(course => course.id === editingItem.id);
            if (index !== -1) {
              courses[index] = { ...editingItem, ...editFormData };
            }
          } else {
            courses.push(editFormData);
          }
          updatedProfile.courses = courses;
          break;
        case 'skill':
          const skills = [...(profile.skills || [])];
          if (editingItem) {
            const index = skills.findIndex(skill => skill.id === editingItem.id);
            if (index !== -1) {
              skills[index] = { ...editingItem, ...editFormData };
            }
          } else {
            skills.push(editFormData);
          }
          updatedProfile.skills = skills;
          break;
        case 'interest':
          const interests = [...(profile.interests || [])];
          if (editingItem) {
            const index = interests.findIndex(interest => interest.id === editingItem.id);
            if (index !== -1) {
              interests[index] = { ...editingItem, ...editFormData };
            }
          } else {
            interests.push(editFormData);
          }
          updatedProfile.interests = interests;
          break;
      }

      const result = await api.user.updateLocalUserProfile(updatedProfile);
      setProfile(result);
      handleEditDialogClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete item
  const handleDeleteItem = async (type: string, itemId: number) => {
    if (!profile) return;

    setIsSubmitting(true);
    try {
      let updatedProfile = { ...profile };

      switch (type) {
        case 'experience':
          updatedProfile.experience = profile.experience?.filter(exp => exp.id !== itemId) || [];
          break;
        case 'education':
          updatedProfile.education = profile.education?.filter(edu => edu.id !== itemId) || [];
          break;
        case 'project':
          updatedProfile.projects = profile.projects?.filter(proj => proj.id !== itemId) || [];
          break;
        case 'course':
          updatedProfile.courses = profile.courses?.filter(course => course.id !== itemId) || [];
          break;
        case 'skill':
          updatedProfile.skills = profile.skills?.filter(skill => skill.id !== itemId) || [];
          break;
        case 'interest':
          updatedProfile.interests = profile.interests?.filter(interest => interest.id !== itemId) || [];
          break;
      }

      const result = await api.user.updateLocalUserProfile(updatedProfile);
      setProfile(result);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover' | 'resume') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    try {
      let result;
      switch (type) {
        case 'profile':
          result = await api.user.uploadProfilePicture(file);
          break;
        case 'cover':
          result = await api.user.uploadCoverPhoto(file);
          break;
        case 'resume':
          result = await api.user.uploadResume(file);
          break;
      }
      setProfile(result);
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete resume
  const handleDeleteResume = async () => {
    if (!profile) return;

    setIsSubmitting(true);
    try {
      const result = await api.user.deleteResume();
      setProfile(result);
    } catch (error) {
      console.error("Error deleting resume:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image dialog open
  const handleImageDialogOpen = (type: 'profile' | 'cover') => {
    setImageDialogType(type);
  };

  // Handle image dialog close
  const handleImageDialogClose = () => {
    setImageDialogType(null);
  };

  // Handle delete image
  const handleDeleteImage = async (type: 'profile' | 'cover') => {
    if (!profile) return;

    setIsSubmitting(true);
    try {
      let result;
      switch (type) {
        case 'profile':
          result = await api.user.deleteProfilePicture();
          break;
        case 'cover':
          result = await api.user.deleteCoverPhoto();
          break;
      }
      setProfile(result);
      handleImageDialogClose();
    } catch (error) {
      console.error(`Error deleting ${type} image:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSectionMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSectionMenuAnchor(event.currentTarget);
  };

  const handleSectionMenuClose = () => {
    setSectionMenuAnchor(null);
  };

  const handleAddSection = (sectionType: 'experience' | 'education' | 'skill' | 'project' | 'course' | 'interest') => {
    handleEditDialogOpen(sectionType);
    handleSectionMenuClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Navbar />

      <Container sx={{ backgroundColor: palette.background.default, minWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Container sx={{ minHeight: '100vh' }} maxWidth="lg">
          <Box sx={{
            my: 4,
            color: 'text.primary'
          }}>
            {loading ? (
              <ProfileSkeleton />
            ) : (
              <>
                {/* Cover Photo and Profile Header */}
                <Paper sx={{
                  position: 'relative',
                  mb: 4,
                  bgcolor: 'background.paper'
                }}>
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: 'action.hover',
                      backgroundImage: profile?.cover_photo_url ? `url(${profile.cover_photo_url})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: isEditable ? 'pointer' : 'default'
                    }}
                    onClick={() => isEditable && handleImageDialogOpen('cover')}
                  >
                    {isEditable && !profile?.cover_photo_url && (
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        color: 'text.secondary'
                      }}>
                        <Typography variant="subtitle1">
                          Click to add a cover photo
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      mb: 2
                    }}>
                      <Box sx={{ position: 'relative', mt: { xs: -5, sm: -7 }, mb: { xs: 2, md: 0 }, alignSelf: 'flex-start' }}>
                        {isEditable ? (
                          <>
                            {!profile?.profile_picture_url ? (
                              <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                  <Avatar
                                    sx={{
                                      width: 38,
                                      height: 38,
                                      bgcolor: 'primary.main',
                                      border: `2px solid ${palette.background.paper}`
                                    }}
                                    onClick={() => handleImageDialogOpen('profile')}
                                  >
                                    <CameraAltIcon sx={{ fontSize: 20 }} />
                                  </Avatar>
                                }
                              >
                                <Avatar
                                  src={profile?.profile_picture_url}
                                  sx={{
                                    width: { xs: 120, sm: 150 },
                                    height: { xs: 120, sm: 150 },
                                    border: `4px solid ${palette.background.paper}`,
                                    boxShadow: 1,
                                    cursor: isEditable ? 'pointer' : 'default'
                                  }}
                                  onClick={() => isEditable && handleImageDialogOpen('profile')}
                                >
                                  {profile?.first_name?.[0]}
                                </Avatar>
                              </Badge>
                            ) : (
                              <Avatar
                                src={profile?.profile_picture_url}
                                sx={{
                                  width: { xs: 120, sm: 150 },
                                  height: { xs: 120, sm: 150 },
                                  border: `4px solid ${palette.background.paper}`,
                                  boxShadow: 1,
                                  cursor: isEditable ? 'pointer' : 'default'
                                }}
                                onClick={() => isEditable && handleImageDialogOpen('profile')}
                              />
                            )}
                          </>
                        ) : (
                          <Avatar
                            src={profile?.profile_picture_url}
                            sx={{
                              width: { xs: 120, sm: 150 },
                              height: { xs: 120, sm: 150 },
                              border: `4px solid ${palette.background.paper}`,
                              boxShadow: 1
                            }}
                          >
                            {!profile?.profile_picture_url && profile?.first_name?.[0]}
                          </Avatar>
                        )}
                      </Box>

                      <Box sx={{ ml: { xs: 0, md: 3 }, flexGrow: 1 }}>
                        <Grid container>
                          <Grid item xs={12} md={9}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {profile?.first_name} {profile?.last_name} {profile?.additional_name && `(${profile.additional_name})`}
                              </Typography>
                              <VerifiedIcon sx={{ ml: 1, color: 'primary.main' }} />
                            </Box>

                            {profile?.name_pronunciation && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Pronunciation: {profile.name_pronunciation}
                              </Typography>
                            )}

                            <Typography variant="body1" sx={{ mt: 1 }}>
                              {profile?.industry}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mt: 1, ml: { xs: 0, sm: -0.6 } }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <LocationOnIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                  {profile?.location || "No location specified"}
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <Button
                                  color="primary"
                                  size="small"
                                  sx={{
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    p: 0,
                                    minWidth: 'auto',
                                    '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                                  }}
                                  onClick={handleContactInfoOpen}
                                >
                                  Contact info
                                </Button>
                              </Box>

                              {isEditable && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <PeopleIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    190 connections
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={3} sx={{
                            display: 'flex',
                            justifyContent: { xs: 'flex-start', md: 'flex-end' },
                            alignItems: 'flex-end',
                            flexDirection: 'column',
                            mt: { xs: 2, md: 0 }
                          }}>
                            {profile?.experience && profile.experience.length > 0 && (
                              <Box sx={{
                                textAlign: { xs: 'left', md: 'right' },
                                p: 1.5,
                                bgcolor: 'action.hover',
                                borderRadius: 1,
                                position: 'relative',
                                width: '100%'
                              }}>
                                {getCurrentPositions(profile.experience).length > 0 ? (
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {getCurrentPositions(profile.experience)[0].company}
                                  </Typography>
                                ) : (
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {sortExperiencesByDate(profile.experience)[0]?.company}
                                  </Typography>
                                )}

                                {profile?.education && profile.education.length > 0 && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {profile.education[0].school}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>

                    {isEditable && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon fontSize="small" />}
                        sx={{
                          position: 'absolute',
                          top: { xs: 230, md: 220 },
                          right: { xs: 16, md: 16 },
                          zIndex: 10,
                          borderRadius: '28px',
                          textTransform: 'none',
                          fontWeight: 600,
                          border: `1px solid ${palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)'}`,
                          color: 'text.primary',
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          p: '6px 12px',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderColor: palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.8)'
                          }
                        }}
                        onClick={() => handleEditDialogOpen('profile')}
                      >
                        Edit profile
                      </Button>
                    )}

                    <Box sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1.5,
                      mt: 2
                    }}>
                      {isEditable && (
                        <>
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: '28px',
                              textTransform: 'none',
                              fontWeight: 600,
                              bgcolor: 'primary.main',
                              '&:hover': { bgcolor: 'primary.dark' }
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
                            aria-controls={Boolean(sectionMenuAnchor) ? 'profile-section-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={Boolean(sectionMenuAnchor) ? 'true' : undefined}
                            sx={{
                              borderRadius: '28px',
                              textTransform: 'none',
                              fontWeight: 600,
                              border: `1px solid ${palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)'}`,
                              color: 'text.primary',
                              '&:hover': {
                                backgroundColor: 'action.hover',
                                borderColor: palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.8)'
                              }
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
                              sx: { minWidth: 200 }
                            }}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                          >
                            <MenuItem onClick={() => handleAddSection('experience')}>
                              <ListItemIcon>
                                <WorkIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Position" />
                            </MenuItem>
                            <MenuItem onClick={() => handleAddSection('education')}>
                              <ListItemIcon>
                                <SchoolIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Education" />
                            </MenuItem>
                            <MenuItem onClick={() => handleAddSection('skill')}>
                              <ListItemIcon>
                                <BuildIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Skill" />
                            </MenuItem>
                            <MenuItem onClick={() => handleAddSection('project')}>
                              <ListItemIcon>
                                <InterestsIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Project" />
                            </MenuItem>
                            <MenuItem onClick={() => handleAddSection('course')}>
                              <ListItemIcon>
                                <SchoolIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Course" />
                            </MenuItem>
                            <MenuItem onClick={() => handleAddSection('interest')}>
                              <ListItemIcon>
                                <InterestsIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Interest" />
                            </MenuItem>
                          </Menu>

                          <Button
                            variant="outlined"
                            sx={{
                              borderRadius: '28px',
                              textTransform: 'none',
                              fontWeight: 600,
                              border: `1px solid ${palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)'}`,
                              color: 'text.primary',
                              '&:hover': {
                                backgroundColor: 'action.hover',
                                borderColor: palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.8)'
                              }
                            }}
                            onClick={handleEnhanceProfileClick}
                          >
                            Enhance profile
                          </Button>

                          <Button
                            variant="text"
                            endIcon={<ExpandMoreIcon />}
                            sx={{
                              borderRadius: '28px',
                              textTransform: 'none',
                              fontWeight: 600,
                              color: 'text.primary',
                              '&:hover': { backgroundColor: 'action.hover' }
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
                              sx: { minWidth: 200 }
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

                <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>About</Typography>
                    {isEditable && (
                      <IconButton onClick={() => handleEditDialogOpen('profile')}>
                        <EditIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {profile?.bio || "No bio provided"}
                  </Typography>
                </Paper>

                <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Experience</Typography>
                    {isEditable && (
                      <IconButton onClick={() => handleEditDialogOpen('experience')}>
                        <AddIcon />
                      </IconButton>
                    )}
                  </Box>

                  {profile?.experience && profile.experience.length > 0 ? (
                    sortExperiencesByDate(profile.experience).map((exp) => (
                      <Box key={exp.id} sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex' }}>
                          <Avatar sx={{ bgcolor: 'action.hover', mr: 2 }}>
                            <WorkIcon />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="h6">{exp.position}</Typography>
                              {isEditable && (
                                <Box>
                                  <IconButton size="small" onClick={() => handleEditDialogOpen('experience', exp)}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" onClick={() => handleDeleteItem('experience', exp.id)}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                            <Typography variant="subtitle1">{exp.company}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDateHelper(exp.start_date)} - {exp.end_date ? formatDateHelper(exp.end_date) : 'Present'}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {exp.description}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      No experience added
                    </Typography>
                  )}
                </Paper>

                <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Education</Typography>
                    {isEditable && (
                      <IconButton onClick={() => handleEditDialogOpen('education')}>
                        <AddIcon />
                      </IconButton>
                    )}
                  </Box>

                  {profile?.education && profile.education.length > 0 ? (
                    profile.education.map((edu) => (
                      <Box key={edu.id} sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex' }}>
                          <Avatar sx={{ bgcolor: 'action.hover', mr: 2 }}>
                            <SchoolIcon />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="h6">{edu.school}</Typography>
                              {isEditable && (
                                <Box>
                                  <IconButton size="small" onClick={() => handleEditDialogOpen('education', edu)}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" onClick={() => handleDeleteItem('education', edu.id)}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                            <Typography variant="subtitle1">{edu.degree}, {edu.field_of_study}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDateHelper(edu.start_date)} - {edu.end_date ? formatDateHelper(edu.end_date) : 'Present'}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      No education added
                    </Typography>
                  )}
                </Paper>

                <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Skills</Typography>
                    {isEditable && (
                      <IconButton onClick={() => handleEditDialogOpen('skill')}>
                        <AddIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile?.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill) => (
                        <Chip
                          key={skill.id}
                          label={skill.name}
                          onDelete={isEditable ? () => handleDeleteItem('skill', skill.id) : undefined}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No skills added
                      </Typography>
                    )}
                  </Box>
                </Paper>

                <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Interests</Typography>
                    {isEditable && (
                      <IconButton onClick={() => handleEditDialogOpen('interest')}>
                        <AddIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile?.interests && profile.interests.length > 0 ? (
                      profile.interests.map((interest) => (
                        <Chip
                          key={interest.id}
                          label={interest.name}
                          onDelete={isEditable ? () => handleDeleteItem('interest', interest.id) : undefined}
                          sx={{
                            bgcolor: palette.mode === 'dark' ? 'rgba(58, 110, 165, 0.3)' : 'rgba(10, 102, 194, 0.08)'
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No interests added
                      </Typography>
                    )}
                  </Box>
                </Paper>

                <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Projects</Typography>
                    {isEditable && (
                      <IconButton onClick={() => handleEditDialogOpen('project')}>
                        <AddIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {profile?.projects && profile.projects.length > 0 ? (
                      profile.projects.map((project) => (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                          <Card>
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">{project.name}</Typography>
                                {isEditable && (
                                  <Box>
                                    <IconButton size="small" onClick={() => handleEditDialogOpen('project', project)}>
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteItem('project', project.id)}>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                )}
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {formatDateHelper(project.start_date)} - {project.end_date ? formatDateHelper(project.end_date) : 'Present'}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {project.description}
                              </Typography>
                              {project.url && (
                                <Button
                                  variant="text"
                                  size="small"
                                  href={project.url}
                                  target="_blank"
                                  sx={{ mt: 1 }}
                                >
                                  View Project
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          No projects added
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>

                <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Courses</Typography>
                    {isEditable && (
                      <IconButton onClick={() => handleEditDialogOpen('course')}>
                        <AddIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    {profile?.courses && profile.courses.length > 0 ? (
                      profile.courses.map((course) => (
                        <Box key={course.id} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {course.name}
                            </Typography>
                            {isEditable && (
                              <Box>
                                <IconButton size="small" onClick={() => handleEditDialogOpen('course', course)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDeleteItem('course', course.id)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                          <Typography variant="body2">
                            {course.provider} • {course.completion_date ? `Completed ${formatDateHelper(course.completion_date)}` : 'In progress'}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No courses added
                      </Typography>
                    )}
                  </Box>
                </Paper>

                <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Contact Info</Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon color="action" sx={{ mr: 2 }} />
                    <Typography>{profile?.contact_info?.email || "No email provided"}</Typography>
                  </Box>

                  {profile?.contact_info?.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon color="action" sx={{ mr: 2 }} />
                      <Typography>{profile.contact_info.phone} ({profile.contact_info.phone_type})</Typography>
                    </Box>
                  )}

                  {profile?.website && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LinkedInIcon color="action" sx={{ mr: 2 }} />
                      <Typography component="a" href={profile.website} target="_blank" sx={{ textDecoration: 'none' }}>
                        {profile.website}
                      </Typography>
                    </Box>
                  )}

                  {profile?.resume_url && (
                    <Box sx={{ mt: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4} md={3} lg={2}>
                          <Button
                            variant="contained"
                            component="a"
                            href={profile.resume_url}
                            target="_blank"
                            startIcon={<WorkIcon />}
                            fullWidth
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              '&:hover': {
                                bgcolor: 'primary.dark',
                              },
                              textTransform: 'none',
                              borderRadius: '24px',
                              py: 1,
                              fontWeight: 600
                            }}
                          >
                            View Resume
                          </Button>
                        </Grid>
                        {isEditable && (
                          <>
                            <Grid item xs={12} sm={4} md={3} lg={2}>
                              <input
                                accept="application/pdf,.doc,.docx"
                                id="resume-upload"
                                type="file"
                                hidden
                                onChange={(e) => handleFileUpload(e, 'resume')}
                              />
                              <label htmlFor="resume-upload" style={{ width: '100%' }}>
                                <Button
                                  variant="outlined"
                                  component="span"
                                  startIcon={<EditIcon />}
                                  fullWidth
                                  sx={{
                                    borderRadius: '24px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    border: `1px solid ${palette.mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)'}`,
                                    color: 'text.primary',
                                    '&:hover': {
                                      backgroundColor: 'action.hover',
                                      borderColor: palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.8)'
                                    }
                                  }}
                                >
                                  Update Resume
                                </Button>
                              </label>
                            </Grid>
                            <Grid item xs={12} sm={4} md={3} lg={2}>
                              <Button
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteResume}
                                fullWidth
                                sx={{
                                  borderRadius: '24px',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  border: '1px solid rgb(210, 60, 60)',
                                  color: 'rgb(210, 60, 60)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(210, 60, 60, 0.04)',
                                    borderColor: 'rgb(180, 40, 40)'
                                  }
                                }}
                              >
                                Delete Resume
                              </Button>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Box>
                  )}

                  {!profile?.resume_url && isEditable && (
                    <Box sx={{ mt: 3 }}>
                      <Grid container>
                        <Grid item xs={12} sm={4} md={3} lg={2}>
                          <input
                            accept="application/pdf,.doc,.docx"
                            id="resume-upload"
                            type="file"
                            hidden
                            onChange={(e) => handleFileUpload(e, 'resume')}
                          />
                          <label htmlFor="resume-upload" style={{ width: '100%' }}>
                            <Button
                              variant="contained"
                              component="span"
                              startIcon={<AddIcon />}
                              fullWidth
                              sx={{
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': {
                                  bgcolor: 'primary.dark',
                                },
                                textTransform: 'none',
                                borderRadius: '24px',
                                py: 1,
                                fontWeight: 600
                              }}
                            >
                              Upload Resume
                            </Button>
                          </label>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Paper>

                <Menu
                  anchorEl={contactInfoAnchor}
                  open={Boolean(contactInfoAnchor)}
                  onClose={handleContactInfoClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      minWidth: 320,
                      maxWidth: 360,
                      borderRadius: 2,
                      p: 1
                    }
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Contact Info
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmailIcon color="action" sx={{ mr: 2 }} />
                        <Typography>{profile?.contact_info?.email || "No email provided"}</Typography>
                      </Box>

                      {profile?.contact_info?.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PhoneIcon color="action" sx={{ mr: 2 }} />
                          <Typography>{profile.contact_info.phone} ({profile.contact_info.phone_type})</Typography>
                        </Box>
                      )}

                      {profile?.website && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LinkedInIcon color="action" sx={{ mr: 2 }} />
                          <Typography component="a" href={profile?.website} target="_blank" sx={{ textDecoration: 'none' }}>
                            {profile.website}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {isEditable && (
                      <Button
                        variant="outlined"
                        fullWidth
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          handleContactInfoClose();
                          handleEditDialogOpen('profile');
                        }}
                        sx={{
                          mt: 1,
                          borderRadius: '28px',
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Edit contact info
                      </Button>
                    )}
                  </Box>
                </Menu>
              </>
            )}
          </Box>
        </Container>

        <Dialog open={editMode !== null} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingItem ? 'Edit' : 'Add'} {editMode === 'profile' ? 'Profile Info' : editMode}
          </DialogTitle>
          <DialogContent>
            {editMode === 'profile' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={editFormData.first_name || ''}
                      onChange={handleFormChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={editFormData.last_name || ''}
                      onChange={handleFormChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Additional Name"
                      name="additional_name"
                      value={editFormData.additional_name || ''}
                      onChange={handleFormChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name Pronunciation"
                      name="name_pronunciation"
                      value={editFormData.name_pronunciation || ''}
                      onChange={handleFormChange}
                      helperText="How to pronounce your name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Industry"
                      name="industry"
                      value={editFormData.industry || ''}
                      onChange={handleFormChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={editFormData.location || ''}
                      onChange={handleFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Website"
                      name="website"
                      value={editFormData.website || ''}
                      onChange={handleFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={editFormData.bio || ''}
                      onChange={handleFormChange}
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {editMode === 'experience' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={editFormData.company || ''}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Position"
                  name="position"
                  value={editFormData.position || ''}
                  onChange={handleFormChange}
                  required
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start Date"
                      value={editFormData.start_date ? new Date(editFormData.start_date) : null}
                      onChange={(date) => handleDateChange('start_date', date)}
                      views={['year', 'month']}
                      slotProps={{ textField: { fullWidth: true, required: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date (leave empty if current)"
                      value={editFormData.end_date ? new Date(editFormData.end_date) : null}
                      onChange={(date) => handleDateChange('end_date', date)}
                      views={['year', 'month']}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={editFormData.description || ''}
                  onChange={handleFormChange}
                  multiline
                  rows={4}
                />
              </Box>
            )}

            {editMode === 'education' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="School"
                  name="school"
                  value={editFormData.school || ''}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Degree"
                  name="degree"
                  value={editFormData.degree || ''}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Field of Study"
                  name="field_of_study"
                  value={editFormData.field_of_study || ''}
                  onChange={handleFormChange}
                  required
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start Date"
                      value={editFormData.start_date ? new Date(editFormData.start_date) : null}
                      onChange={(date) => handleDateChange('start_date', date)}
                      views={['year', 'month']}
                      slotProps={{ textField: { fullWidth: true, required: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date (leave empty if current)"
                      value={editFormData.end_date ? new Date(editFormData.end_date) : null}
                      onChange={(date) => handleDateChange('end_date', date)}
                      views={['year', 'month']}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {editMode === 'project' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Project Name"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  fullWidth
                  label="URL"
                  name="url"
                  value={editFormData.url || ''}
                  onChange={handleFormChange}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start Date"
                      value={editFormData.start_date ? new Date(editFormData.start_date) : null}
                      onChange={(date) => handleDateChange('start_date', date)}
                      views={['year', 'month']}
                      slotProps={{ textField: { fullWidth: true, required: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date (leave empty if current)"
                      value={editFormData.end_date ? new Date(editFormData.end_date) : null}
                      onChange={(date) => handleDateChange('end_date', date)}
                      views={['year', 'month']}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={editFormData.description || ''}
                  onChange={handleFormChange}
                  multiline
                  rows={4}
                  required
                />
              </Box>
            )}

            {editMode === 'course' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Course Name"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Provider"
                  name="provider"
                  value={editFormData.provider || ''}
                  onChange={handleFormChange}
                  required
                />
                <DatePicker
                  label="Completion Date"
                  value={editFormData.completion_date ? new Date(editFormData.completion_date) : null}
                  onChange={(date) => handleDateChange('completion_date', date)}
                  views={['year', 'month']}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Box>
            )}

            {editMode === 'skill' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Skill Name"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleFormChange}
                  required
                />
              </Box>
            )}

            {editMode === 'interest' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Interest Name"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleFormChange}
                  required
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose} disabled={isSubmitting}>Cancel</Button>
            <Button
              onClick={handleSaveChanges}
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={imageDialogType !== null}
          onClose={handleImageDialogClose}
          maxWidth={imageDialogType === 'cover' ? 'md' : 'sm'}
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: palette.mode === 'dark' ? '#121212' : 'black',
              color: 'white',
              borderRadius: '8px',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle sx={{
            color: 'white',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            p: 2
          }}>
            {imageDialogType === 'profile' ? 'Profile Photo' : 'Cover Photo'}
            <IconButton
              onClick={handleImageDialogClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white'
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {imageDialogType === 'profile' && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
                bgcolor: '#000',
                p: 3
              }}>
                {profile?.profile_picture_url ? (
                  <Avatar
                    src={profile.profile_picture_url}
                    sx={{ width: 250, height: 250 }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 250,
                      height: 250,
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <AddIcon sx={{ fontSize: 100, color: 'white' }} />
                  </Avatar>
                )}
              </Box>
            )}

            {imageDialogType === 'cover' && profile?.cover_photo_url && (
              <Box
                sx={{
                  width: '100%',
                  height: 350,
                  backgroundImage: `url(${profile.cover_photo_url})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  bgcolor: '#000'
                }}
              />
            )}

            {imageDialogType === 'cover' && !profile?.cover_photo_url && (
              <Box
                sx={{
                  width: '100%',
                  height: 350,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: '#000'
                }}
              >
                <AddIcon sx={{ fontSize: 100, color: 'action.hover' }} />
              </Box>
            )}

            <Box sx={{
              p: 2,
              bgcolor: 'rgba(0,0,0,0.9)',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <input
                    accept="image/*"
                    id={`${imageDialogType}-upload-dialog`}
                    type="file"
                    hidden
                    onChange={(e) => {
                      handleFileUpload(e, imageDialogType as 'profile' | 'cover');
                      handleImageDialogClose();
                    }}
                  />
                  <label htmlFor={`${imageDialogType}-upload-dialog`} style={{ width: '100%' }}>
                    <Button
                      variant="contained"
                      component="span"
                      fullWidth
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                        textTransform: 'none',
                        borderRadius: '24px',
                        py: 1
                      }}
                      disabled={isSubmitting}
                    >
                      Change {imageDialogType === 'profile' ? 'photo' : 'cover'}
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleDeleteImage(imageDialogType as 'profile' | 'cover')}
                    disabled={isSubmitting || (
                      (imageDialogType === 'profile' && !profile?.profile_picture_url) ||
                      (imageDialogType === 'cover' && !profile?.cover_photo_url)
                    )}
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: '#ccc',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                      textTransform: 'none',
                      borderRadius: '24px',
                      py: 1
                    }}
                  >
                    Delete {imageDialogType === 'profile' ? 'photo' : 'cover'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog
          open={premiumDialogOpen}
          onClose={() => setPremiumDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ borderBottom: '1px solid action.hover' }}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                Try Premium Features
              </Typography>
              <IconButton onClick={() => setPremiumDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'warning.main',
                  margin: '0 auto',
                  mb: 2
                }}
              >
                <WorkIcon sx={{ fontSize: 40, color: 'white' }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                Upgrade to Premium
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                Get access to exclusive tools and features to boost your professional network and career.
              </Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Premium features include:
            </Typography>

            <Box component="ul" sx={{ pl: 2 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>See who viewed your profile</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>Advanced search filters</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>Direct messaging to any professional</Typography>
              </Box>
              <Box component="li">
                <Typography>Access to premium learning courses</Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid action.hover' }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: 'primary.main',
                borderRadius: '28px',
                textTransform: 'none',
                py: 1,
                fontWeight: 600
              }}
              onClick={() => setPremiumDialogOpen(false)}
            >
              Try Premium for Free
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={profileInfoOpen}
          onClose={handleProfileInfoClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ borderBottom: '1px solid action.hover' }}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                About this Profile
              </Typography>
              <IconButton onClick={handleProfileInfoClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Profile Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Member since</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {profile?.created_at ? formatDate(new Date(profile.created_at), "MMMM yyyy") : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Last updated</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {profile?.updated_at ? formatDate(new Date(profile.updated_at), "MMMM d, yyyy") : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">User ID</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {profile?.user_id || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Profile Privacy</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {profile?.privacy || "Public"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid action.hover' }}>
            <Button
              onClick={handleProfileInfoClose}
              sx={{
                borderRadius: '28px',
                textTransform: 'none',
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
}

// Profile skeleton for loading state
const ProfileSkeleton = () => {
  return (
    <Box>
      <Skeleton variant="rectangular" height={200} />
      <Box sx={{ p: 3, display: 'flex' }}>
        <Skeleton variant="circular" width={150} height={150} sx={{ mt: -7 }} />
        <Box sx={{ ml: 3, width: '100%' }}>
          <Skeleton variant="text" height={50} width="40%" />
          <Skeleton variant="text" height={30} width="30%" />
          <Skeleton variant="text" height={25} width="20%" />
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Skeleton variant="text" height={40} width="20%" />
        <Skeleton variant="text" height={100} />
      </Paper>

      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Skeleton variant="text" height={40} width="20%" />
        <Box sx={{ mt: 2 }}>
          {[1, 2].map((i) => (
            <Box key={i} sx={{ display: 'flex', mb: 2 }}>
              <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
              <Box sx={{ width: '100%' }}>
                <Skeleton variant="text" height={30} width="40%" />
                <Skeleton variant="text" height={25} width="30%" />
                <Skeleton variant="text" height={20} width="20%" />
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
        <Skeleton variant="text" height={40} width="20%" />
        <Box sx={{ mt: 2 }}>
          {[1, 2].map((i) => (
            <Box key={i} sx={{ display: 'flex', mb: 2 }}>
              <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
              <Box sx={{ width: '100%' }}>
                <Skeleton variant="text" height={30} width="40%" />
                <Skeleton variant="text" height={25} width="30%" />
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
