import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Palette,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Experience, Profile } from "@ascend/api-client/models";

interface ExperienceSectionProps {
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
      | "interest",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
  ) => void;
  sortExperiencesByDate: (experiences: Experience[]) => Experience[];
  handleDeleteItem: (section: string, id: number) => void;
  formatDateHelper: (date: Date | string | undefined) => string;
  palette: Palette;
}

export const ExperienceSection = ({
  profile,
  isEditable,
  handleEditDialogOpen,
  sortExperiencesByDate,
  handleDeleteItem,
  formatDateHelper,
  palette
}: ExperienceSectionProps) => {
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
          Experience
        </Typography>
        {isEditable && (
          <IconButton onClick={() => handleEditDialogOpen("experience")}>
            <AddIcon />
          </IconButton>
        )}
      </Box>

      {/* Experience Section */}
      {profile?.experience && profile.experience.length > 0 ? (
        sortExperiencesByDate(profile.experience).map((exp) => (
          <Box key={exp.id} sx={{ mt: 2 }}>
            <Box sx={{ display: "flex" }}>
              <Avatar sx={{ bgcolor: "action.hover", mr: 2 }}>
                <WorkIcon sx={{ color: palette.text.secondary }} />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">{exp.position}</Typography>
                  {isEditable && (
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditDialogOpen("experience", exp)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem("experience", exp.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Typography variant="subtitle1">{exp.company}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateHelper(exp.start_date)} -{" "}
                  {exp.end_date ? formatDateHelper(exp.end_date) : "Present"}
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
  );
};
