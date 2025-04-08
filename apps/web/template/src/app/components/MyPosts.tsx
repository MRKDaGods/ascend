"use client";

import { useEffect, useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
} from "@mui/material";

import TuneIcon from "@mui/icons-material/Tune";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import InsightsIcon from "@mui/icons-material/InsertChart";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useProfileStore } from "../store/useProfileStore";

const MyPosts = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { userData, setUserData } = useProfileStore();
  const openToWork = userData?.opentowork;

  useEffect(() => {
    if (!userData) {
      const fetchUserData = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/user");
          const data = await res.json();
          setUserData(data);
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      };

      fetchUserData();
    }
  }, [userData, setUserData]);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Card sx={{ width: 300, borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setOpen(true)}>
                <ListItemIcon>
                  <TuneIcon />
                </ListItemIcon>
                <ListItemText primary="Preferences" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => router.push("/MyJobs")}>
                <ListItemIcon>
                  <BookmarkIcon sx={{ color: "black" }} />
                </ListItemIcon>
                <ListItemText primary="My jobs" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <InsightsIcon sx={{ color: "#F4A261" }} />
                </ListItemIcon>
                <ListItemText primary="My Career Insights" />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1 }} />

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

      {/* Preferences Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 600,
            fontSize: "1.25rem",
          }}
        >
          Preferences
          <IconButton onClick={handleClose}>
            <ArrowForwardIosIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 1 }}>
          <List>
            {/* My interests section */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
              My interests
            </Typography>

            {/* Open to work */}
            <ListItem
              secondaryAction={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
            >
              <ListItemText
                primary={
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    Open to work
                    <span
                      style={{
                        padding: "2px 8px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        borderRadius: "10px",
                        backgroundColor: openToWork ? "#d2f2df" : "#e0e0e0",
                        color: openToWork ? "#1a7f37" : "#616161",
                      }}
                    >
                      {openToWork ? "On" : "Off"}
                    </span>
                  </span>
                }
                secondary={
                  openToWork
                    ? "Job preferences visible to all LinkedIn members"
                    : "Job preferences are hidden"
                }
              />
            </ListItem>

            {/* Job alerts */}
            <ListItem
              secondaryAction={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
            >
              <ListItemText
                primary="Job alerts"
                secondary="student intern and others"
              />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            {/* My qualifications section */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
              My qualifications
            </Typography>

            {/* Resume and application data */}
            <ListItem
              secondaryAction={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
            >
              <ListItemText
                primary="Resumes and application data"
                secondary="Privately share your skills and experience with recruiters"
              />
            </ListItem>

            {/* AI-powered resume drafts */}
            <ListItem
              secondaryAction={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
            >
              <ListItemText
                primary="AI-powered resume drafts"
                secondary="Private to you"
              />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            {/* verification */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
              My Verifications
            </Typography>
            <ListItem
              secondaryAction={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
            >
              <ListItemText
                primary="verifications"
                secondary="Hirers can see your verification on your profile"
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyPosts;
