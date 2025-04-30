import { Box, Button, Grid, Typography } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import { Experience, Profile } from "@ascend/api-client/models";

interface ProfileInfoProps {
  profile: Profile;
  handleContactInfoOpen: (e: React.MouseEvent<HTMLElement>) => void;
  isEditable: boolean;
  sortExperiencesByDate: (experiences: Experience[]) => Experience[];
}

export const ProfileInfo = ({ profile, handleContactInfoOpen, isEditable, sortExperiencesByDate }: ProfileInfoProps) => {
  const getCurrentPositions = (experiences: Experience[]): Experience[] => {
    return experiences.filter((exp) => !exp.end_date);
  };

  return (
    <Box sx={{ ml: { xs: 0, md: 3 }, flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {profile?.first_name} {profile?.last_name}{" "}
              {profile?.additional_name && `(${profile.additional_name})`}
            </Typography>
            <VerifiedIcon sx={{ ml: 1, color: "primary.main" }} />
          </Box>

          {profile?.headline && (
            <Typography variant="h6" sx={{ mt: 0.5 }}>
              {profile.headline}
            </Typography>
          )}

          {profile?.name_pronunciation && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Pronunciation: {profile.name_pronunciation}
            </Typography>
          )}

          <Typography variant="body1" sx={{ mt: 1 }}>
            {profile?.industry}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              mt: 1,
              ml: { xs: 0, sm: -0.6 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 2,
              }}
            >
              <LocationOnIcon fontSize="small" color="action" />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                {profile?.location || "No location specified"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 2,
              }}
            >
              <Button
                color="primary"
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  p: 0,
                  minWidth: "auto",
                  "&:hover": {
                    bgcolor: "transparent",
                    textDecoration: "underline",
                  },
                }}
                onClick={handleContactInfoOpen}
              >
                Contact info
              </Button>
            </Box>

            {isEditable && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PeopleIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  190 connections
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: "flex",
            justifyContent: {
              xs: "flex-start",
              md: "flex-end",
            },
            alignItems: "flex-end",
            flexDirection: "column",
            mt: { xs: 2, md: 0 },
          }}
        >
          {profile?.experience && profile.experience.length > 0 && (
            <Box
              sx={{
                textAlign: { xs: "left", md: "right" },
                p: 1.5,
                bgcolor: "action.hover",
                borderRadius: 1,
                position: "relative",
                width: "100%",
              }}
            >
              {getCurrentPositions(profile.experience).length > 0 ? (
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {getCurrentPositions(profile.experience)[0].company}
                </Typography>
              ) : (
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {sortExperiencesByDate(profile.experience)[0]?.company}
                </Typography>
              )}

              {profile?.education && profile.education.length > 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {profile.education[0].school}
                </Typography>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
