import { Profile } from "@ascend/api-client/models";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState, useEffect } from "react";

interface EditDialogProps {
  open: boolean;
  mode: "profile" | "experience" | "education" | "project" | "course" | "skill" | "interest" | null;
  item: any;
  onClose: () => void;
  onSave: (formData: any) => Promise<void>;
  profile?: Profile;
  formData?: any; // Add formData prop to accept values from parent
}

export const EditDialog = ({
  open,
  mode,
  item,
  onClose,
  onSave,
  formData: initialFormData,
}: EditDialogProps) => {
  const [formData, setFormData] = useState<any>(initialFormData || item || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when item, mode, or initialFormData changes
  useEffect(() => {
    if (initialFormData) {
      setFormData(initialFormData);
    } else if (item) {
      setFormData(item);
    } else {
      setFormData({});
    }
  }, [item, mode, initialFormData, open]);

  // Handle form input change
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle date change
  const handleDateChange = (name: string, date: Date | null) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEntityName = () => {
    if (!mode) return "";
    
    switch(mode) {
      case "profile": return "Profile Info";
      case "experience": return "Experience";
      case "education": return "Education";
      case "project": return "Project";
      case "course": return "Course";
      case "skill": return "Skill";
      case "interest": return "Interest";
      default: return mode;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {item ? "Edit" : "Add"} {getEntityName()}
      </DialogTitle>
      <DialogContent>
        {mode === "profile" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Headline"
                  name="headline"
                  value={formData.headline || ""}
                  onChange={handleFormChange}
                  helperText="Professional headline (e.g., Software Engineer at Company)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Additional Name"
                  name="additional_name"
                  value={formData.additional_name || ""}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name Pronunciation"
                  name="name_pronunciation"
                  value={formData.name_pronunciation || ""}
                  onChange={handleFormChange}
                  helperText="How to pronounce your name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Industry"
                  name="industry"
                  value={formData.industry || ""}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleFormChange}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {mode === "experience" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={formData.company || ""}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="Position"
              name="position"
              value={formData.position || ""}
              onChange={handleFormChange}
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.start_date ? new Date(formData.start_date) : null}
                  onChange={(date) => handleDateChange("start_date", date)}
                  views={["year", "month"]}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date (leave empty if current)"
                  value={formData.end_date ? new Date(formData.end_date) : null}
                  onChange={(date) => handleDateChange("end_date", date)}
                  views={["year", "month"]}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description || ""}
              onChange={handleFormChange}
              multiline
              rows={4}
            />
          </Box>
        )}

        {mode === "education" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="School"
              name="school"
              value={formData.school || ""}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="Degree"
              name="degree"
              value={formData.degree || ""}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="Field of Study"
              name="field_of_study"
              value={formData.field_of_study || ""}
              onChange={handleFormChange}
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.start_date ? new Date(formData.start_date) : null}
                  onChange={(date) => handleDateChange("start_date", date)}
                  views={["year", "month"]}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date (leave empty if current)"
                  value={formData.end_date ? new Date(formData.end_date) : null}
                  onChange={(date) => handleDateChange("end_date", date)}
                  views={["year", "month"]}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {mode === "project" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Project Name"
              name="name"
              value={formData.name || ""}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="URL"
              name="url"
              value={formData.url || ""}
              onChange={handleFormChange}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.start_date ? new Date(formData.start_date) : null}
                  onChange={(date) => handleDateChange("start_date", date)}
                  views={["year", "month"]}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date (leave empty if current)"
                  value={formData.end_date ? new Date(formData.end_date) : null}
                  onChange={(date) => handleDateChange("end_date", date)}
                  views={["year", "month"]}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description || ""}
              onChange={handleFormChange}
              multiline
              rows={4}
              required
            />
          </Box>
        )}

        {mode === "course" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Course Name"
              name="name"
              value={formData.name || ""}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              label="Provider"
              name="provider"
              value={formData.provider || ""}
              onChange={handleFormChange}
              required
            />
            <DatePicker
              label="Completion Date"
              value={formData.completion_date ? new Date(formData.completion_date) : null}
              onChange={(date) => handleDateChange("completion_date", date)}
              views={["year", "month"]}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>
        )}

        {mode === "skill" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Skill Name"
              name="name"
              value={formData.name || ""}
              onChange={handleFormChange}
              required
            />
          </Box>
        )}

        {mode === "interest" && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Interest Name"
              name="name"
              value={formData.name || ""}
              onChange={handleFormChange}
              required
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
