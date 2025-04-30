import { Box, IconButton, Paper, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Profile } from "@ascend/api-client/models";

export const AboutSection = ({
  profile,
  isEditable,
  handleEditDialogOpen,
}: {
  profile: Profile;
  isEditable: boolean;
  handleEditDialogOpen: (
    section:
      | "profile"
      | "experience"
      | "education"
      | "project"
      | "course"
      | "skill"
      | "interest"
  ) => void;
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: "background.paper" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          About
        </Typography>
        {isEditable && (
          <IconButton onClick={() => handleEditDialogOpen("profile")}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {profile?.bio || "No bio provided"}
      </Typography>
    </Paper>
  );
};
