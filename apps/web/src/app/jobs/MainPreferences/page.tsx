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
import { usePreferencesModal } from "@/app/stores/usePreferencesModal";
import { useProfileStore } from "@/app/stores/useProfileStore";

const MainPreferencesPage = () => {
  const { setView } = usePreferencesModal();
  const { userData } = useProfileStore();
 
  return (
    <List>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
        My interests
      </Typography>

      <ListItem
        component="div"
        sx={{ cursor: "pointer" }}
        aria-label="Open to work preferences"
        secondaryAction={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
      >
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
