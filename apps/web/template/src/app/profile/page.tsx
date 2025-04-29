"use client";

import { api } from "@/api";
import { Experience, Profile } from "@ascend/api-client/models";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format as formatDate } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Navbar from "../components/Navbar";
import { ProfileSkeleton } from "../components/Profile/ProfileSkeleton";
import { ProfileSummarySection } from "../components/Profile/ProfileSummarySection";
import { ExperienceSection } from "../components/Profile/ExperienceSection";
import { EducationSection } from "../components/Profile/EducationSection";
import { SkillsSections } from "../components/Profile/SkillsSection";
import { InterestsSection } from "../components/Profile/InterestsSection";
import { ProjectsSection } from "../components/Profile/ProjectsSections";
import { CoursesSection } from "../components/Profile/CoursesSection";
import { ContactInfoSection } from "../components/Profile/ContactInfoSection";
import { AboutSection } from "../components/Profile/AboutSection";

function Home() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Profile>();
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit dialog states
  const [editMode, setEditMode] = useState<
    | "profile"
    | "experience"
    | "education"
    | "project"
    | "course"
    | "skill"
    | "interest"
    | null
  >(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  // Image dialog state
  const [imageDialogType, setImageDialogType] = useState<
    "profile" | "cover" | null
  >(null);

  // Add profile section menu
  const [contactInfoAnchor, setContactInfoAnchor] =
    useState<null | HTMLElement>(null);

  // Add states for premium popup and resources menu
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);

  const [profileInfoOpen, setProfileInfoOpen] = useState(false);

  // Add state for viewing profile picture in modal
  const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);

  const { palette } = useTheme();

  const profileId = searchParams.get("id");

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const profileIdNumber = parseInt(profileId || "", 10);

      if (profileIdNumber) {
        const data = await api.user.getUserProfile(profileIdNumber);
        setProfile(data);
        setIsEditable(false);
      } else {
        const data = await api.user.getLocalUserProfile();
        setProfile(data);
        setIsEditable(true);
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

  const handleProfileInfoClose = () => {
    setProfileInfoOpen(false);
  };

  const handleContactInfoClose = () => {
    setContactInfoAnchor(null);
  };

  // Handle edit dialog open
  const handleEditDialogOpen = (
    mode:
      | "profile"
      | "experience"
      | "education"
      | "project"
      | "course"
      | "skill"
      | "interest",
    item?: any
  ) => {
    // Prevent editing if not our profile
    if (!isEditable) return;

    setEditMode(mode);
    setEditingItem(item || null);

    if (mode === "profile") {
      setEditFormData({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        headline: profile?.headline || "",
        industry: profile?.industry,
        location: profile?.location,
        bio: profile?.bio,
        website: profile?.website,
        additional_name: profile?.additional_name,
        name_pronunciation: profile?.name_pronunciation,
      });
    } else if (item) {
      setEditFormData({ ...item });
    } else {
      switch (mode) {
        case "experience":
          setEditFormData({
            company: "",
            position: "",
            start_date: new Date(),
            description: "",
          });
          break;
        case "education":
          setEditFormData({
            school: "",
            degree: "",
            field_of_study: "",
            start_date: new Date(),
          });
          break;
        case "project":
          setEditFormData({
            name: "",
            description: "",
            start_date: new Date(),
            url: "",
          });
          break;
        case "course":
          setEditFormData({
            name: "",
            provider: "",
            completion_date: new Date(),
          });
          break;
        case "skill":
          setEditFormData({
            name: "",
          });
          break;
        case "interest":
          setEditFormData({
            name: "",
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
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle date change
  const handleDateChange = (name: string, date: Date | null) => {
    setEditFormData({
      ...editFormData,
      [name]: date,
    });
  };

  // Handle save profile changes
  const handleSaveChanges = async () => {
    if (!profile) return;

    setIsSubmitting(true);
    try {
      let updatedProfile = { ...profile };

      switch (editMode) {
        case "profile":
          updatedProfile = {
            ...profile,
            ...editFormData,
          };
          break;
        case "experience":
          const experiences = [...(profile.experience || [])];
          if (editingItem) {
            const index = experiences.findIndex(
              (exp) => exp.id === editingItem.id
            );
            if (index !== -1) {
              experiences[index] = { ...editingItem, ...editFormData };
            }
          } else {
            experiences.push(editFormData);
          }
          updatedProfile.experience = experiences;
          break;
        case "education":
          const educations = [...(profile.education || [])];
          if (editingItem) {
            const index = educations.findIndex(
              (edu) => edu.id === editingItem.id
            );
            if (index !== -1) {
              educations[index] = { ...editingItem, ...editFormData };
            }
          } else {
            educations.push(editFormData);
          }
          updatedProfile.education = educations;
          break;
        case "project":
          const projects = [...(profile.projects || [])];
          if (editingItem) {
            const index = projects.findIndex(
              (proj) => proj.id === editingItem.id
            );
            if (index !== -1) {
              projects[index] = { ...editingItem, ...editFormData };
            }
          } else {
            projects.push(editFormData);
          }
          updatedProfile.projects = projects;
          break;
        case "course":
          const courses = [...(profile.courses || [])];
          if (editingItem) {
            const index = courses.findIndex(
              (course) => course.id === editingItem.id
            );
            if (index !== -1) {
              courses[index] = { ...editingItem, ...editFormData };
            }
          } else {
            courses.push(editFormData);
          }
          updatedProfile.courses = courses;
          break;
        case "skill":
          const skills = [...(profile.skills || [])];
          if (editingItem) {
            const index = skills.findIndex(
              (skill) => skill.id === editingItem.id
            );
            if (index !== -1) {
              skills[index] = { ...editingItem, ...editFormData };
            }
          } else {
            skills.push(editFormData);
          }
          updatedProfile.skills = skills;
          break;
        case "interest":
          const interests = [...(profile.interests || [])];
          if (editingItem) {
            const index = interests.findIndex(
              (interest) => interest.id === editingItem.id
            );
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
        case "experience":
          updatedProfile.experience =
            profile.experience?.filter((exp) => exp.id !== itemId) || [];
          break;
        case "education":
          updatedProfile.education =
            profile.education?.filter((edu) => edu.id !== itemId) || [];
          break;
        case "project":
          updatedProfile.projects =
            profile.projects?.filter((proj) => proj.id !== itemId) || [];
          break;
        case "course":
          updatedProfile.courses =
            profile.courses?.filter((course) => course.id !== itemId) || [];
          break;
        case "skill":
          updatedProfile.skills =
            profile.skills?.filter((skill) => skill.id !== itemId) || [];
          break;
        case "interest":
          updatedProfile.interests =
            profile.interests?.filter((interest) => interest.id !== itemId) ||
            [];
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
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover" | "resume"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    try {
      let result;
      switch (type) {
        case "profile":
          result = await api.user.uploadProfilePicture(file);
          break;
        case "cover":
          result = await api.user.uploadCoverPhoto(file);
          break;
        case "resume":
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

  // Handle image dialog close
  const handleImageDialogClose = () => {
    setImageDialogType(null);
  };

  // Handle delete image
  const handleDeleteImage = async (type: "profile" | "cover") => {
    if (!profile) return;

    setIsSubmitting(true);
    try {
      let result;
      switch (type) {
        case "profile":
          result = await api.user.deleteProfilePicture();
          break;
        case "cover":
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

  // Handle close view image
  const handleCloseViewImage = () => {
    setViewImageUrl(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Navbar />

      <Container
        sx={{
          backgroundColor: palette.background.default,
          minWidth: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Container sx={{ minHeight: "100vh" }} maxWidth="lg">
          <Box
            sx={{
              my: 4,
              color: "text.primary",
            }}
          >
            {loading ? (
              <ProfileSkeleton />
            ) : (
              profile && (
                <>
                  {/* Cover Photo and Profile Photo Section & info */}
                  <ProfileSummarySection
                    isEditable={isEditable}
                    profile={profile}
                    palette={palette}
                    setContactInfoAnchor={setContactInfoAnchor}
                    setPremiumDialogOpen={setPremiumDialogOpen}
                    sortExperiencesByDate={sortExperiencesByDate}
                    handleEditDialogOpen={handleEditDialogOpen}
                    setImageDialogType={setImageDialogType}
                    setViewImageUrl={setViewImageUrl}
                    setProfileInfoOpen={setProfileInfoOpen}
                  />

                  {/* About Section */}
                  <AboutSection
                    profile={profile}
                    isEditable={isEditable}
                    handleEditDialogOpen={handleEditDialogOpen}
                  />

                  {/* Experience Section */}
                  <ExperienceSection
                    profile={profile}
                    isEditable={isEditable}
                    handleEditDialogOpen={handleEditDialogOpen}
                    sortExperiencesByDate={sortExperiencesByDate}
                    handleDeleteItem={handleDeleteItem}
                    formatDateHelper={formatDateHelper}
                    palette={palette}
                  />

                  {/* Education */}
                  <EducationSection
                    isEditable={isEditable}
                    profile={profile}
                    handleEditDialogOpen={handleEditDialogOpen}
                    handleDeleteItem={handleDeleteItem}
                    formatDateHelper={formatDateHelper}
                    palette={palette}
                  />

                  {/* Skills */}
                  <SkillsSections
                    profile={profile}
                    isEditable={isEditable}
                    handleEditDialogOpen={handleEditDialogOpen}
                    handleDeleteItem={handleDeleteItem}
                  />

                  {/* Interests */}
                  <InterestsSection
                    profile={profile}
                    isEditable={isEditable}
                    handleEditDialogOpen={handleEditDialogOpen}
                    handleDeleteItem={handleDeleteItem}
                    palette={palette}
                  />

                  {/* Projects */}
                  <ProjectsSection
                    profile={profile}
                    isEditable={isEditable}
                    handleEditDialogOpen={handleEditDialogOpen}
                    handleDeleteItem={handleDeleteItem}
                    formatDateHelper={formatDateHelper}
                  />

                  {/* Courses */}
                  <CoursesSection
                    profile={profile}
                    isEditable={isEditable}
                    handleEditDialogOpen={handleEditDialogOpen}
                    handleDeleteItem={handleDeleteItem}
                    formatDateHelper={formatDateHelper}
                  />

                  {/* Contact Info */}
                  <ContactInfoSection
                    profile={profile}
                    isEditable={isEditable}
                    handleFileUpload={handleFileUpload}
                    palette={palette}
                    setIsSubmitting={setIsSubmitting}
                    setProfile={setProfile}
                  />

                  <Menu
                    anchorEl={contactInfoAnchor}
                    open={Boolean(contactInfoAnchor)}
                    onClose={handleContactInfoClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        minWidth: 320,
                        maxWidth: 360,
                        borderRadius: 2,
                        p: 1,
                      },
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 2 }}
                      >
                        Contact Info
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <EmailIcon color="action" sx={{ mr: 2 }} />
                          <Typography>
                            {profile?.contact_info?.email ||
                              "No email provided"}
                          </Typography>
                        </Box>

                        {profile?.contact_info?.phone && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <PhoneIcon color="action" sx={{ mr: 2 }} />
                            <Typography>
                              {profile.contact_info.phone} (
                              {profile.contact_info.phone_type})
                            </Typography>
                          </Box>
                        )}

                        {profile?.website && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <LinkedInIcon color="action" sx={{ mr: 2 }} />
                            <Typography
                              component="a"
                              href={profile?.website}
                              target="_blank"
                              sx={{ textDecoration: "none" }}
                            >
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
                            handleEditDialogOpen("profile");
                          }}
                          sx={{
                            mt: 1,
                            borderRadius: "28px",
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          Edit contact info
                        </Button>
                      )}
                    </Box>
                  </Menu>
                </>
              )
            )}
          </Box>
        </Container>

        <Dialog
          open={editMode !== null}
          onClose={handleEditDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingItem ? "Edit" : "Add"}{" "}
            {editMode === "profile" ? "Profile Info" : editMode}
          </DialogTitle>
          <DialogContent>
            {editMode === "profile" && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={editFormData.first_name || ""}
                      onChange={handleFormChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={editFormData.last_name || ""}
                      onChange={handleFormChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Headline"
                      name="headline"
                      value={editFormData.headline || ""}
                      onChange={handleFormChange}
                      helperText="Professional headline (e.g., Software Engineer at Company)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Additional Name"
                      name="additional_name"
                      value={editFormData.additional_name || ""}
                      onChange={handleFormChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name Pronunciation"
                      name="name_pronunciation"
                      value={editFormData.name_pronunciation || ""}
                      onChange={handleFormChange}
                      helperText="How to pronounce your name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Industry"
                      name="industry"
                      value={editFormData.industry || ""}
                      onChange={handleFormChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={editFormData.location || ""}
                      onChange={handleFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Website"
                      name="website"
                      value={editFormData.website || ""}
                      onChange={handleFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={editFormData.bio || ""}
                      onChange={handleFormChange}
                      multiline
                      rows={4}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {editMode === "experience" && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={editFormData.company || ""}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Position"
                  name="position"
                  value={editFormData.position || ""}
                  onChange={handleFormChange}
                  required
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start Date"
                      value={
                        editFormData.start_date
                          ? new Date(editFormData.start_date)
                          : null
                      }
                      onChange={(date) => handleDateChange("start_date", date)}
                      views={["year", "month"]}
                      slotProps={{
                        textField: { fullWidth: true, required: true },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date (leave empty if current)"
                      value={
                        editFormData.end_date
                          ? new Date(editFormData.end_date)
                          : null
                      }
                      onChange={(date) => handleDateChange("end_date", date)}
                      views={["year", "month"]}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={editFormData.description || ""}
                  onChange={handleFormChange}
                  multiline
                  rows={4}
                />
              </Box>
            )}

            {editMode === "education" && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <TextField
                  fullWidth
                  label="School"
                  name="school"
                  value={editFormData.school || ""}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Degree"
                  name="degree"
                  value={editFormData.degree || ""}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Field of Study"
                  name="field_of_study"
                  value={editFormData.field_of_study || ""}
                  onChange={handleFormChange}
                  required
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start Date"
                      value={
                        editFormData.start_date
                          ? new Date(editFormData.start_date)
                          : null
                      }
                      onChange={(date) => handleDateChange("start_date", date)}
                      views={["year", "month"]}
                      slotProps={{
                        textField: { fullWidth: true, required: true },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date (leave empty if current)"
                      value={
                        editFormData.end_date
                          ? new Date(editFormData.end_date)
                          : null
                      }
                      onChange={(date) => handleDateChange("end_date", date)}
                      views={["year", "month"]}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {editMode === "project" && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <TextField
                  fullWidth
                  label="Project Name"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  fullWidth
                  label="URL"
                  name="url"
                  value={editFormData.url || ""}
                  onChange={handleFormChange}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start Date"
                      value={
                        editFormData.start_date
                          ? new Date(editFormData.start_date)
                          : null
                      }
                      onChange={(date) => handleDateChange("start_date", date)}
                      views={["year", "month"]}
                      slotProps={{
                        textField: { fullWidth: true, required: true },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date (leave empty if current)"
                      value={
                        editFormData.end_date
                          ? new Date(editFormData.end_date)
                          : null
                      }
                      onChange={(date) => handleDateChange("end_date", date)}
                      views={["year", "month"]}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={editFormData.description || ""}
                  onChange={handleFormChange}
                  multiline
                  rows={4}
                  required
                />
              </Box>
            )}

            {editMode === "course" && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <TextField
                  fullWidth
                  label="Course Name"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Provider"
                  name="provider"
                  value={editFormData.provider || ""}
                  onChange={handleFormChange}
                  required
                />
                <DatePicker
                  label="Completion Date"
                  value={
                    editFormData.completion_date
                      ? new Date(editFormData.completion_date)
                      : null
                  }
                  onChange={(date) => handleDateChange("completion_date", date)}
                  views={["year", "month"]}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Box>
            )}

            {editMode === "skill" && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <TextField
                  fullWidth
                  label="Skill Name"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleFormChange}
                  required
                />
              </Box>
            )}

            {editMode === "interest" && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <TextField
                  fullWidth
                  label="Interest Name"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleFormChange}
                  required
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose} disabled={isSubmitting}>
              Cancel
            </Button>
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
          maxWidth={imageDialogType === "cover" ? "md" : "sm"}
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: palette.mode === "dark" ? "#121212" : "black",
              color: "white",
              borderRadius: "8px",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              color: "white",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              p: 2,
            }}
          >
            {imageDialogType === "profile" ? "Profile Photo" : "Cover Photo"}
            <IconButton
              onClick={handleImageDialogClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {imageDialogType === "profile" && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px",
                  bgcolor: "#000",
                  p: 3,
                }}
              >
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
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AddIcon sx={{ fontSize: 100, color: "white" }} />
                  </Avatar>
                )}
              </Box>
            )}

            {imageDialogType === "cover" && profile?.cover_photo_url && (
              <Box
                sx={{
                  width: "100%",
                  height: 350,
                  backgroundImage: `url(${profile.cover_photo_url})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  bgcolor: "#000",
                }}
              />
            )}

            {imageDialogType === "cover" && !profile?.cover_photo_url && (
              <Box
                sx={{
                  width: "100%",
                  height: 350,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#000",
                }}
              >
                <AddIcon sx={{ fontSize: 100, color: "action.hover" }} />
              </Box>
            )}

            <Box
              sx={{
                p: 2,
                bgcolor: "rgba(0,0,0,0.9)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <input
                    accept="image/*"
                    id={`${imageDialogType}-upload-dialog`}
                    type="file"
                    hidden
                    onChange={(e) => {
                      handleFileUpload(
                        e,
                        imageDialogType as "profile" | "cover"
                      );
                      handleImageDialogClose();
                    }}
                  />
                  <label
                    htmlFor={`${imageDialogType}-upload-dialog`}
                    style={{ width: "100%" }}
                  >
                    <Button
                      variant="contained"
                      component="span"
                      fullWidth
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                        textTransform: "none",
                        borderRadius: "24px",
                        py: 1,
                      }}
                      disabled={isSubmitting}
                    >
                      Change {imageDialogType === "profile" ? "photo" : "cover"}
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() =>
                      handleDeleteImage(imageDialogType as "profile" | "cover")
                    }
                    disabled={
                      isSubmitting ||
                      (imageDialogType === "profile" &&
                        !profile?.profile_picture_url) ||
                      (imageDialogType === "cover" && !profile?.cover_photo_url)
                    }
                    sx={{
                      color: "white",
                      borderColor: "white",
                      "&:hover": {
                        borderColor: "#ccc",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                      textTransform: "none",
                      borderRadius: "24px",
                      py: 1,
                    }}
                  >
                    Delete {imageDialogType === "profile" ? "photo" : "cover"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Dialog for viewing profile image for non-editable profiles */}
        <Dialog
          open={viewImageUrl !== null}
          onClose={handleCloseViewImage}
          maxWidth="md"
          PaperProps={{
            sx: {
              bgcolor: palette.mode === "dark" ? "#121212" : "black",
              color: "white",
              borderRadius: "8px",
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              color: "white",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              p: 2,
            }}
          >
            {viewImageUrl === profile?.profile_picture_url
              ? "Profile Photo"
              : "Cover Photo"}
            <IconButton
              onClick={handleCloseViewImage}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
                bgcolor: "#000",
                p: 3,
              }}
            >
              {viewImageUrl && viewImageUrl === profile?.profile_picture_url ? (
                <Avatar
                  src={viewImageUrl}
                  sx={{
                    width: 300,
                    height: 300,
                    boxShadow: "0 0 20px rgba(255,255,255,0.2)",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100vw",
                    height: 500,
                    backgroundImage: viewImageUrl
                      ? `url(${viewImageUrl})`
                      : "none",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              )}
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog
          open={premiumDialogOpen}
          onClose={() => setPremiumDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ borderBottom: "1px solid action.hover" }}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                Try Premium Features
              </Typography>
              <IconButton onClick={() => setPremiumDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "warning.main",
                  margin: "0 auto",
                  mb: 2,
                }}
              >
                <WorkIcon sx={{ fontSize: 40, color: "white" }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                Upgrade to Premium
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 400, mx: "auto" }}
              >
                Get access to exclusive tools and features to boost your
                professional network and career.
              </Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
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
          <DialogActions sx={{ p: 2, borderTop: "1px solid action.hover" }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "primary.main",
                borderRadius: "28px",
                textTransform: "none",
                py: 1,
                fontWeight: 600,
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
          <DialogTitle sx={{ borderBottom: "1px solid action.hover" }}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                About this Profile
              </Typography>
              <IconButton onClick={handleProfileInfoClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Profile Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Member since
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {profile?.created_at
                      ? formatDate(new Date(profile.created_at), "MMMM yyyy")
                      : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Last updated
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {profile?.updated_at
                      ? formatDate(new Date(profile.updated_at), "MMMM d, yyyy")
                      : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    User ID
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {profile?.user_id || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Profile Privacy
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    variant="body2"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {profile?.privacy || "Public"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: "1px solid action.hover" }}>
            <Button
              onClick={handleProfileInfoClose}
              sx={{
                borderRadius: "28px",
                textTransform: "none",
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

export default Home;
