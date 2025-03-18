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
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Switch,
  IconButton,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune"; 
import BookmarkIcon from "@mui/icons-material/Bookmark"; 
import InsightsIcon from "@mui/icons-material/InsertChart"; 
import PostAddIcon from "@mui/icons-material/PostAdd"; 
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; 

const MyPosts = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Job Sidebar Card */}
      <Card sx={{ width: 300, borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <List>
            {/* Preferences - Opens Modal */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => setOpen(true)}>
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
                <ListItemText primary="Post a free job" sx={{ color: "#0A66C2", fontWeight: "bold" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Preferences Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="div">Preferences</Typography>
          <IconButton onClick={handleClose}>
            <ArrowForwardIosIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {/* My Interests */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
              My interests
            </Typography>
            <ListItem>
              <ListItemText primary="Open to work" secondary="Job preferences visible to all LinkedIn members" />
              <Switch defaultChecked color="success" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Job alerts" secondary="Student intern and others" />
              <ArrowForwardIosIcon />
            </ListItem>

            <Divider sx={{ my: 1 }} />

            {/* My Qualifications */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
              My qualifications
            </Typography>
            <ListItem>
              <ListItemText primary="Resumes and application data" secondary="Privately share your skills with recruiters" />
              <ArrowForwardIosIcon />
            </ListItem>
            <ListItem>
              <ListItemText primary="AI-powered resume drafts" secondary="Private to you" />
              <ArrowForwardIosIcon />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyPosts;
