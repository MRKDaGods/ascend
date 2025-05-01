"use client";

import { useEffect } from "react";
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

import { useProfileStore } from "../stores/useProfileStore";
import { usePreferencesModal } from "../stores/usePreferencesModal";
import PreferencesModal from "./PreferencesModal";

const ListCard = () => {
  const router = useRouter();
  const { userData, setUserData } = useProfileStore();
  const { openModal } = usePreferencesModal();

  useEffect(() => {
    if (!userData) {
      // BACKEND INTEGRATION NOTE:
      // Currently using static user data for development
      // TODO: Integrate with backend API to fetch actual user data
      // Expected response: { id: number, name: string, email: string, ... }
      // Implementation should call setUserData(data) with the response
      
      // Set static user data instead of fetching
      // setUserData({
      //   id: 1,
      //   name: "Demo User",
      //   email: "demo@example.com",
      //   // Add any other fields your app expects
      // });
    
    }
  }, [userData, setUserData]);

  return (
    <>
      <Card sx={{ width: 300, borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => openModal("main")}>
                <ListItemIcon>
                  <TuneIcon />
                </ListItemIcon>
                <ListItemText primary="Preferences" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={() => router.push("/jobs/MyJobs")}>
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
              <ListItemButton onClick={() => router.push("/jobs/PostJob")}>
                <ListItemIcon>
                  <PostAddIcon sx={{ color: "#0A66C2" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Post a free job"
                  sx={{ color: "#0A66C2", fontWeight: "bold" , textDecoration: "underline"}}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <PreferencesModal />
    </>
  );
};

export default ListCard;
