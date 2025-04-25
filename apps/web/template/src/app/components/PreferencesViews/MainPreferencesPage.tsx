"use client";

import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { usePreferencesModal } from "../../store/usePreferencesModal";
import { useProfileStore } from "../../store/useProfileStore";

const MainPreferencesPage = () => {
  const { setView } = usePreferencesModal();
  const { userData } = useProfileStore();
  const openToWork = userData?.opentowork;
 
  return (
    <List>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
        My interests
      </Typography>

      <ListItem
        component="div"
        onClick={() => setView("openToWork")}
        sx={{ cursor: "pointer" }}
        aria-label="Open to work preferences"
        secondaryAction={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
      >
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Open to work
              <Box
                sx={{
                  padding: "2px 8px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  borderRadius: "10px",
                  backgroundColor: openToWork ? "#d2f2df" : "#e0e0e0",
                  color: openToWork ? "#1a7f37" : "#616161",
                }}
              >
                {openToWork ? "On" : "Off"}
              </Box>
            </Box>
          }
          secondary={
            openToWork
              ? "Job preferences visible to all LinkedIn members"
              : "Job preferences are hidden"
          }
        />
      </ListItem>

      <ListItem
        component="div"
        onClick={() => setView("jobAlerts")}
        sx={{ cursor: "pointer" }}
        aria-label="Job alerts preferences"
        secondaryAction={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
      >
        <ListItemText
          primary="Job alerts"
          secondary="student intern and others"
        />
      </ListItem>

      <Divider sx={{ my: 1 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
        My qualifications
      </Typography>

      <ListItem
        component="div"
        onClick={() => setView("resume")}
        sx={{ cursor: "pointer" }}
        aria-label="Resume preferences"
        secondaryAction={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
      >
        <ListItemText
          primary="Resumes and application data"
          secondary="Privately share your skills and experience with recruiters"
        />
      </ListItem>

      <ListItem
        component="div"
        onClick={() => setView("aiResume")}
        sx={{ cursor: "pointer" }}
        aria-label="AI-powered resume drafts preferences"
        secondaryAction={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
      >
        <ListItemText
          primary="AI-powered resume drafts"
          secondary="Private to you"
        />
      </ListItem>

      <Divider sx={{ my: 1 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
        My Verifications
      </Typography>

      <ListItem
        component="div"
        onClick={() => setView("verifications")}
        sx={{ cursor: "pointer" }}
        aria-label="Verifications preferences"
        secondaryAction={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
      >
        <ListItemText
          primary="Verifications"
          secondary="Hirers can see your verification on your profile"
        />
      </ListItem>
    </List>
  );
};

export default MainPreferencesPage;
