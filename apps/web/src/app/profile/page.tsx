"use client";

import { api } from "@/api";
import { Experience, Profile } from "@ascend/api-client/models";
import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format as formatDate } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AboutSection } from "../components/Profile/AboutSection";
import { ContactInfoMenu } from "../components/Profile/ContactInfoMenu";
import { ContactInfoSection } from "../components/Profile/ContactInfoSection";
import { CoursesSection } from "../components/Profile/CoursesSection";
import { EditDialog } from "../components/Profile/EditDialog";
import { EducationSection } from "../components/Profile/EducationSection";
import { ExperienceSection } from "../components/Profile/ExperienceSection";
import { ImageDialog } from "../components/Profile/ImageDialog";
import { InterestsSection } from "../components/Profile/InterestsSection";
import { PremiumDialog } from "../components/Profile/PremiumDialog";
import { ProfileInfoDialog } from "../components/Profile/ProfileInfoDialog";
import { ProfileSkeleton } from "../components/Profile/ProfileSkeleton";
import { ProfileSummarySection } from "../components/Profile/ProfileSummarySection";
import { ProjectsSection } from "../components/Profile/ProjectsSections";
import { SkillsSections } from "../components/Profile/SkillsSection";
import { ViewImageDialog } from "../components/Profile/ViewImageDialog";

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
  const [imageDialogType, setImageDialogType] = useState<
    "profile" | "cover" | null
  >(null);
  const [contactInfoAnchor, setContactInfoAnchor] =
    useState<null | HTMLElement>(null);
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [profileInfoOpen, setProfileInfoOpen] = useState(false);
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

  // Handle save profile changes
  const handleSaveChanges = async (formData: any) => {
    if (!profile) return;

    setIsSubmitting(true);
    try {
      let updatedProfile = { ...profile };

      switch (editMode) {
        case "profile":
          updatedProfile = {
            ...profile,
            ...formData,
          };
          break;
        case "experience":
          const experiences = [...(profile.experience || [])];
          if (editingItem) {
            const index = experiences.findIndex(
              (exp) => exp.id === editingItem.id
            );
            if (index !== -1) {
              experiences[index] = { ...editingItem, ...formData };
            }
          } else {
            experiences.push(formData);
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
              educations[index] = { ...editingItem, ...formData };
            }
          } else {
            educations.push(formData);
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
              projects[index] = { ...editingItem, ...formData };
            }
          } else {
            projects.push(formData);
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
              courses[index] = { ...editingItem, ...formData };
            }
          } else {
            courses.push(formData);
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
              skills[index] = { ...editingItem, ...formData };
            }
          } else {
            skills.push(formData);
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
              interests[index] = { ...editingItem, ...formData };
            }
          } else {
            interests.push(formData);
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
      setImageDialogType(null); // Close dialog after upload
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

  // Handle contact info edit
  const handleContactInfoEdit = () => {
    handleContactInfoClose();
    handleEditDialogOpen("profile");
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

                  {/* Menus and Dialogs */}
                  <ContactInfoMenu
                    anchorEl={contactInfoAnchor}
                    profile={profile}
                    isEditable={isEditable}
                    onClose={handleContactInfoClose}
                    onEdit={handleContactInfoEdit}
                  />

                  <EditDialog
                    open={editMode !== null}
                    mode={editMode}
                    item={editingItem}
                    onClose={handleEditDialogClose}
                    onSave={handleSaveChanges}
                    profile={profile}
                    formData={editFormData}
                  />

                  <ImageDialog
                    type={imageDialogType}
                    profile={profile}
                    onClose={handleImageDialogClose}
                    onFileUpload={handleFileUpload}
                    onDeleteImage={handleDeleteImage}
                    isSubmitting={isSubmitting}
                    palette={palette}
                  />

                  <ViewImageDialog
                    imageUrl={viewImageUrl}
                    onClose={handleCloseViewImage}
                    profile={profile}
                    palette={palette}
                  />

                  <PremiumDialog
                    open={premiumDialogOpen}
                    onClose={() => setPremiumDialogOpen(false)}
                  />

                  <ProfileInfoDialog
                    open={profileInfoOpen}
                    profile={profile}
                    onClose={handleProfileInfoClose}
                  />
                </>
              )
            )}
          </Box>
        </Container>
      </Container>
    </LocalizationProvider>
  );
}

export default Home;
