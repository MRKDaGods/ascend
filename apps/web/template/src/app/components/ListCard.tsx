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
} from "@mui/material";

import TuneIcon from "@mui/icons-material/Tune";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import InsightsIcon from "@mui/icons-material/InsertChart";
import PostAddIcon from "@mui/icons-material/PostAdd";

import { useProfileStore } from "../store/useProfileStore";
import { usePreferencesModal } from "../store/usePreferencesModal";
import PreferencesModal from "./PreferencesModal";

const ListCard = () => {
  const router = useRouter();
  const { userData, setUserData } = useProfileStore();
  const { openModal } = usePreferencesModal();

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
                  sx={{ color: "#0A66C2", fontWeight: "bold" , textDecoration: "underline"}}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Preferences Modal (centralized & reusable) */}
      <PreferencesModal />
    </>
  );
};

export default ListCard;
