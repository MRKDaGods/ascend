import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Palette,
  Paper,
  Typography,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Profile } from "@ascend/api-client/models";

interface EducationSectionProps {
  isEditable: boolean;
  profile: Profile;
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
    item?: any
  ) => void;
  handleDeleteItem: (section: string, itemId: number) => void;
  formatDateHelper: (date: string | Date) => string;
  palette: Palette;
}

export const EducationSection = ({
  isEditable,
  profile,
  handleEditDialogOpen,
  handleDeleteItem,
  formatDateHelper,
  palette,
}: EducationSectionProps) => {
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
          Education
        </Typography>
        {isEditable && (
          <IconButton onClick={() => handleEditDialogOpen("education")}>
            <AddIcon />
          </IconButton>
        )}
      </Box>

      {profile?.education && profile.education.length > 0 ? (
        profile.education.map((edu) => (
          <Box key={edu.id} sx={{ mt: 2 }}>
            <Box sx={{ display: "flex" }}>
              <Avatar sx={{ bgcolor: "action.hover", mr: 2 }}>
                <SchoolIcon sx={{ color: palette.text.secondary }} />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6">{edu.school}</Typography>
                  {isEditable && (
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditDialogOpen("education", edu)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem("education", edu.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Typography variant="subtitle1">
                  {edu.degree}, {edu.field_of_study}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateHelper(edu.start_date)} -{" "}
                  {edu.end_date ? formatDateHelper(edu.end_date) : "Present"}
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
  );
};
