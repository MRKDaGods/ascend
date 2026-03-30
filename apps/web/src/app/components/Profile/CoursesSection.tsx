import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Profile } from "@ascend/api-client/models";

interface CourseProps {
  profile: Profile;
  isEditable: boolean;
  handleEditDialogOpen: (
    type:
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
  handleDeleteItem: (type: string, id: number) => void;
  formatDateHelper: (date: string | Date) => string;
}

export const CoursesSection = ({
  profile,
  isEditable,
  handleEditDialogOpen,
  handleDeleteItem,
  formatDateHelper,
}: CourseProps) => {
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
          Courses
        </Typography>
        {isEditable && (
          <IconButton onClick={() => handleEditDialogOpen("course")}>
            <AddIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        {profile?.courses && profile.courses.length > 0 ? (
          profile.courses.map((course) => (
            <Box key={course.id} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {course.name}
                </Typography>
                {isEditable && (
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditDialogOpen("course", course)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteItem("course", course.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Typography variant="body2">
                {course.provider} •{" "}
                {course.completion_date
                  ? `Completed ${formatDateHelper(course.completion_date)}`
                  : "In progress"}
              </Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No courses added
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
