'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import InsightsIcon from "@mui/icons-material/InsertChart";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PreferencesModal from "./PreferencesModal";
import JobAlertsModal from "./JobAlertsModal";
import ResumeApplicationDataModal from "./ResumeApplicationDataModal";
import AIResumeDraftsModal from "./AIResumeDraftsModal"; // Import the AI Resume Drafts Modal

const MyPosts = () => {
  const [openPreferences, setOpenPreferences] = useState(false);
  const [openJobAlerts, setOpenJobAlerts] = useState(false);
  const [openResumeModal, setOpenResumeModal] = useState(false);
  const [openAIModal, setOpenAIModal] = useState(false); // State for AI Resume Drafts Modal
  const [topPicks, setTopPicks] = useState(true);
  const router = useRouter();

  return (
    <>
      {/* Sidebar Card */}
      <Card sx={{ width: 300, borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <List>
            {/* Preferences */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => setOpenPreferences(true)}>
                <ListItemIcon>
                  <TuneIcon />
                </ListItemIcon>
                <ListItemText primary="Preferences" />
              </ListItemButton>
            </ListItem>

            {/* My Jobs */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => router.push("/MyJobs")}>
                <ListItemIcon>
                  <BookmarkIcon sx={{ color: "black" }} />
                </ListItemIcon>
                <ListItemText primary="My jobs" />
              </ListItemButton>
            </ListItem>

            {/* My Career Insights */}
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <InsightsIcon sx={{ color: "#F4A261" }} />
                </ListItemIcon>
                <ListItemText primary="My Career Insights" />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1 }} />

            {/* Post a Free Job */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => router.push("/PostJob")}>
                <ListItemIcon>
                  <PostAddIcon sx={{ color: "#0A66C2" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Post a free job"
                  sx={{ color: "#0A66C2", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Preferences Modal */}
      <PreferencesModal
        open={openPreferences}
        onClose={() => setOpenPreferences(false)}
        onOpenJobAlerts={() => setOpenJobAlerts(true)}
        onOpenResumeModal={() => setOpenResumeModal(true)}
        onOpenAIModal={() => setOpenAIModal(true)} // Pass this function
      />

      {/* Job Alerts Modal */}
      <JobAlertsModal
        open={openJobAlerts}
        onClose={() => setOpenJobAlerts(false)}
        topPicks={topPicks}
        setTopPicks={setTopPicks}
      />

      {/* Resume Application Data Modal */}
      <ResumeApplicationDataModal
        open={openResumeModal}
        onClose={() => setOpenResumeModal(false)}
      />

      {/* AI Resume Drafts Modal */}
      <AIResumeDraftsModal
        open={openAIModal}
        onClose={() => setOpenAIModal(false)}
      />
    </>
  );
};

export default MyPosts;