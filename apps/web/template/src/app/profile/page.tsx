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
// import LinkedInProfile from "../components/LinkedInProfile";


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
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
        <Navbar />
        <p>Ammar is working on profile</p>
        {/* <LinkedInProfile /> */}
      </Box>
    );
}

export default Home;
