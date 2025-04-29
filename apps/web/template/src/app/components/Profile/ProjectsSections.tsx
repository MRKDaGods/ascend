import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Profile } from "@ascend/api-client/models";

interface ProjectsSectionProps {
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
    item?: any
  ) => void;
  handleDeleteItem: (itemType: string, itemId: number) => void;
  formatDateHelper: (date: string | Date) => string;
}

export const ProjectsSection = ({
  profile,
  isEditable,
  handleEditDialogOpen,
  handleDeleteItem,
  formatDateHelper
}: ProjectsSectionProps) => {
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
          Projects
        </Typography>
        {isEditable && (
          <IconButton onClick={() => handleEditDialogOpen("project")}>
            <AddIcon />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {profile?.projects && profile.projects.length > 0 ? (
          profile.projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6">{project.name}</Typography>
                    {isEditable && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleEditDialogOpen("project", project)
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDeleteItem("project", project.id)
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatDateHelper(project.start_date)} -{" "}
                    {project.end_date
                      ? formatDateHelper(project.end_date)
                      : "Present"}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {project.description}
                  </Typography>
                  {project.url && (
                    <Button
                      variant="text"
                      size="small"
                      href={project.url}
                      target="_blank"
                      sx={{ mt: 1 }}
                    >
                      View Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              No projects added
            </Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
