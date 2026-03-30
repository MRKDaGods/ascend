import { Box, Chip, IconButton, Palette, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Profile } from "@ascend/api-client/models";

interface InterestsSectionsProps {
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
  palette: Palette;
}

export const InterestsSection = ({
  profile,
  isEditable,
  handleEditDialogOpen,
  handleDeleteItem,
  palette,
}: InterestsSectionsProps) => {
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
          Interests
        </Typography>
        {isEditable && (
          <IconButton onClick={() => handleEditDialogOpen("interest")}>
            <AddIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {profile?.interests && profile.interests.length > 0 ? (
          profile.interests.map((interest) => (
            <Chip
              key={interest.id}
              label={interest.name}
              onDelete={
                isEditable
                  ? () => handleDeleteItem("interest", interest.id)
                  : undefined
              }
              sx={{
                bgcolor:
                  palette.mode === "dark"
                    ? "rgba(58, 110, 165, 0.3)"
                    : "rgba(10, 102, 194, 0.08)",
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
  );
};
