'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Switch,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";

interface PreferencesModalProps {
  open: boolean;
  onClose: () => void;
  onOpenJobAlerts: () => void;
  onOpenResumeModal: () => void; // Add this prop to open the ResumeApplicationDataModal
  onOpenAIModal: () => void; // Add this prop to open the AI Resume Drafts Modal
}

const PreferencesModal = ({
  open,
  onClose,
  onOpenJobAlerts,
  onOpenResumeModal, // Add this prop
  onOpenAIModal, // Add this prop
}: PreferencesModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Preferences</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List>
          {/* My Interests Section */}
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
            My interests
          </Typography>
          <ListItem>
            <ListItemText
              primary="Open to work"
              secondary="Job preferences visible to all LinkedIn members"
            />
            <Switch defaultChecked color="success" />
          </ListItem>
          <ListItem
            component="button"
            onClick={() => {
              onClose();
              onOpenJobAlerts();
            }}
            sx={{
              backgroundColor: "white", // Default background color
              "&:hover": {
                backgroundColor: "#f3f2ef", // Gray background on hover
              },
            }}
          >
            <ListItemText primary="Job alerts" secondary="Student intern and others" />
            <ArrowForwardIosIcon />
          </ListItem>

          <Divider sx={{ my: 1 }} />

          {/* My Qualifications Section */}
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
            My qualifications
          </Typography>
          <ListItem
            component="button"
            onClick={() => {
              onClose(); // Close the PreferencesModal
              onOpenResumeModal(); // Open the ResumeApplicationDataModal
            }}
            sx={{
              backgroundColor: "white", // Default background color
              "&:hover": {
                backgroundColor: "#f3f2ef", // Gray background on hover
              },
            }}
          >
            <ListItemText
              primary="Resumes and application data"
              secondary="Privately share your skills with recruiters"
            />
            <ArrowForwardIosIcon />
          </ListItem>
          <ListItem
            component="button"
            onClick={() => {
              onClose(); // Close Preferences Modal
              onOpenAIModal(); // Open AI Resume Drafts Modal
            }}
            sx={{
              backgroundColor: "white", // Default background color
              "&:hover": {
                backgroundColor: "#f3f2ef", // Gray background on hover
              },
            }}
          >
            <ListItemText
              primary="AI-powered resume drafts"
              secondary="Private to you"
            />
            <ArrowForwardIosIcon />
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesModal;