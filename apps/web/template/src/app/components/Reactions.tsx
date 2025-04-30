"use client";

import React, { useState } from "react";
import {
  Button,
  useTheme,
  Paper,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import { ThumbUp } from "@mui/icons-material";
import { usePostStore, ReactionType } from "../stores/usePostStore"; // ✅ import ReactionType from store!

interface Props {
  postId: number;
  liked: boolean;
  onLike: () => void;
}

const Reactions: React.FC<Props> = ({ postId, liked, onLike }) => {
  const theme = useTheme();
  const { postReactions, reactToPostFromAPI } = usePostStore();

  const [hoveredReaction, setHoveredReaction] = useState<ReactionType | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const reactions: {
    label: ReactionType;
    imgSrc: string;
  }[] = [
    { label: "Like", imgSrc: "/reactions/like.png" },
    { label: "Celebrate", imgSrc: "/reactions/clap.png" },
    { label: "Support", imgSrc: "/reactions/support.png" },
    { label: "Love", imgSrc: "/reactions/love.png" },
    { label: "Insightful", imgSrc: "/reactions/idea.png" },
    { label: "Funny", imgSrc: "/reactions/funny.png" },
  ];

  const currentReaction = postReactions[postId];

  const getReactionIcon = () => {
    if (!currentReaction) {
      return (
        <ThumbUp sx={{ color: theme.palette.text.secondary }} />
      );
    }
  
    const found = reactions.find((r) => r.label === currentReaction);
    return found ? (
      <img
        src={found.imgSrc}
        alt={currentReaction}
        style={{ width: 22, height: 22 }}
      />
    ) : (
      <ThumbUp sx={{ color: theme.palette.text.secondary }} />
    );
  };  

  const handleMainClick = async () => {
    try {
      if (currentReaction) {
        // Already reacted → unlike
        usePostStore.getState().clearReaction(postId);
      } else {
        // No reaction → Like
        await reactToPostFromAPI(postId, "like");
        usePostStore.getState().setReaction(postId, "Like");
      }
      onLike(); // Still call external callback
    } catch (error) {
      console.error("❌ Failed to react:", error);
    }
  };  
  
  const handleReactionClick = async (reaction: ReactionType) => {
    try {
      await reactToPostFromAPI(postId, reaction.toLowerCase() as any);
      usePostStore.getState().setReaction(postId, reaction); 
    } catch (error) {
      console.error("❌ Failed to react:", error);
    }
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredReaction(null);
      }}
      sx={{ position: "relative", display: "inline-block", m: 0, p: 0 }}
    >
      {isHovered && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            bottom: "calc(100% - 2px)",
            left: 0,
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            gap: 1,
            borderRadius: 5,
            p: 1,
            zIndex: 20,
          }}
        >
          {reactions.map((reaction) => (
            <Tooltip title={reaction.label} key={reaction.label}>
              <IconButton
                id={`${reaction.label.toLowerCase()}-reaction-button`}
                onClick={() => handleReactionClick(reaction.label)}
                onMouseEnter={() => setHoveredReaction(reaction.label)}
                sx={{
                  padding: 0.5,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <img
                  src={reaction.imgSrc}
                  alt={reaction.label}
                  style={{ width: 30, height: 30 }}
                />
              </IconButton>
            </Tooltip>
          ))}
        </Paper>
      )}

      <Button
        id="main-reaction-button"
        startIcon={getReactionIcon()}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          color: currentReaction ? "#0a66c2" : theme.palette.text.secondary,
        }}
        onClick={handleMainClick}
      >
        {currentReaction
          ? currentReaction.charAt(0).toUpperCase() + currentReaction.slice(1)
          : "Like"}
      </Button>
    </Box>
  );
};

export default Reactions;
