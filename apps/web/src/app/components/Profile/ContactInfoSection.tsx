import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Palette,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { api } from "@/api";
import { Profile } from "@ascend/api-client/models";

export const ContactInfoSection = ({
  profile,
  isEditable,
  handleFileUpload,
  palette,
  setIsSubmitting,
  setProfile,
}: {
  profile: Profile;
  isEditable: boolean;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover" | "resume"
  ) => void;
  palette: Palette;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setProfile: (profile: Profile) => void;
}) => {
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

  return (
    <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Contact Info
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <EmailIcon color="action" sx={{ mr: 2 }} />
        <Typography>
          {profile?.contact_info?.email || "No email provided"}
        </Typography>
      </Box>

      {profile?.contact_info?.phone && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <PhoneIcon color="action" sx={{ mr: 2 }} />
          <Typography>
            {profile.contact_info.phone} ({profile.contact_info.phone_type})
          </Typography>
        </Box>
      )}

      {profile?.website && (
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <LinkedInIcon color="action" sx={{ mr: 2 }} />
          <Typography
            component="a"
            href={profile.website}
            target="_blank"
            sx={{ textDecoration: "none" }}
          >
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
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  textTransform: "none",
                  borderRadius: "24px",
                  py: 1,
                  fontWeight: 600,
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
                    onChange={(e) => handleFileUpload(e, "resume")}
                  />
                  <label htmlFor="resume-upload" style={{ width: "100%" }}>
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<EditIcon />}
                      fullWidth
                      sx={{
                        borderRadius: "24px",
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
                      borderRadius: "24px",
                      textTransform: "none",
                      fontWeight: 600,
                      border: "1px solid rgb(210, 60, 60)",
                      color: "rgb(210, 60, 60)",
                      "&:hover": {
                        backgroundColor: "rgba(210, 60, 60, 0.04)",
                        borderColor: "rgb(180, 40, 40)",
                      },
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
                onChange={(e) => handleFileUpload(e, "resume")}
              />
              <label htmlFor="resume-upload" style={{ width: "100%" }}>
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<AddIcon />}
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
                    fontWeight: 600,
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
  );
};
