import { Box, Chip, IconButton, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Profile } from "@ascend/api-client/models";

interface SkillsSectionsProps {
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
  handleDeleteItem: (itemType: string, itemId: number) => void;
}

export const SkillsSections = ({
  profile,
  isEditable,
  handleEditDialogOpen,
  handleDeleteItem,
}: SkillsSectionsProps) => {
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
          Skills
        </Typography>
        {isEditable && (
          <IconButton onClick={() => handleEditDialogOpen("skill")}>
            <AddIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {profile?.skills && profile.skills.length > 0 ? (
          profile.skills.map((skill) => (
            <Chip
              key={skill.id}
              label={skill.name}
              onDelete={
                isEditable
                  ? () => handleDeleteItem("skill", skill.id)
                  : undefined
              }
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No skills added
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
