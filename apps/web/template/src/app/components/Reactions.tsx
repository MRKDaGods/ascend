"use client";

import React, { useState } from "react";
import {
  Button,
  useTheme,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";
import { ThumbUp } from "@mui/icons-material";
import { usePostStore } from "../stores/usePostStore";

// Reaction icons
import FavoriteIcon from "@mui/icons-material/Favorite";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

type ReactionType = "like" | "clap" | "support" | "love" | "idea" | "funny";

interface Props {
  postId: number;
  liked: boolean;
  onLike: () => void;
}

const Reactions: React.FC<Props> = ({ postId, liked, onLike }) => {
  const theme = useTheme();
  const { postReactions, setReaction } = usePostStore();

  const [showReactions, setShowReactions] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<ReactionType | null>(null);

  const reactions: {
    label: ReactionType;
    icon: React.ReactElement<{ fontSize?: "small" | "medium" | "large" }>;
  }[] = [
    { label: "like", icon: <ThumbUp /> },
    { label: "clap", icon: <EmojiEventsIcon /> },
    { label: "support", icon: <VolunteerActivismIcon /> },
    { label: "love", icon: <FavoriteIcon /> },
    { label: "idea", icon: <EmojiObjectsIcon /> },
    { label: "funny", icon: <SentimentSatisfiedAltIcon /> },
  ];

  const currentReaction = postReactions[postId];

  return (
    <>
      {showReactions && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            bottom: 50,
            left: 30,
            backgroundColor:
              theme.palette.mode === "dark" ? "#fff" : "#f9f9f9",
            display: "flex",
            gap: 1,
            borderRadius: 5,
            p: 1,
            zIndex: 20,
          }}
          onMouseLeave={() => setShowReactions(false)}
        >
          {reactions.map((reaction) => (
            <Tooltip title={reaction.label} key={reaction.label}>
              <IconButton
                onClick={() => {
                  setReaction(postId, reaction.label);
                  setShowReactions(false);
                }}
                onMouseEnter={() => setHoveredReaction(reaction.label)}
                sx={{
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                {React.cloneElement(reaction.icon, { fontSize: "medium" })}
              </IconButton>
            </Tooltip>
          ))}
        </Paper>
      )}

      <Button
        startIcon={<ThumbUp />}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          color: currentReaction ? "#0a66c2" : theme.palette.text.secondary,
        }}
        onMouseEnter={() => setShowReactions(true)}
        onClick={() => {
          if (hoveredReaction) {
            setReaction(postId, hoveredReaction);
          } else {
            onLike(); // fallback to default like
          }
        }}
      >
        {currentReaction
          ? currentReaction.charAt(0).toUpperCase() + currentReaction.slice(1)
          : "Like"}
      </Button>
    </>
  );
};

export default Reactions;
