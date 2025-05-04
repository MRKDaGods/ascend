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
import { usePostStore, ReactionType } from "../stores/usePostStore";

interface Props {
  postId: number;
}

const Reactions: React.FC<Props> = ({ postId }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<ReactionType | null>(null);

  const { posts, reactToPostAPI, removeReactionFromPost } = usePostStore();

  const post = posts.find((p) => p.id === postId);
  const currentReaction = post?.reaction;

  const reactions: { label: ReactionType; imgSrc: string }[] = [
    { label: "like", imgSrc: "/reactions/like.png" },
    { label: "celebrate", imgSrc: "/reactions/clap.png" },
    { label: "support", imgSrc: "/reactions/support.png" },
    { label: "love", imgSrc: "/reactions/love.png" },
    { label: "insightful", imgSrc: "/reactions/idea.png" },
    { label: "funny", imgSrc: "/reactions/funny.png" },
  ];

  const getReactionIcon = () => {
    const found = reactions.find((r) => r.label === currentReaction);
    return found ? (
      <img src={found.imgSrc} alt={currentReaction} style={{ width: 22, height: 22 }} />
    ) : (
      <ThumbUp sx={{ color: theme.palette.text.secondary }} />
    );
  };

  const handleMainClick = async () => {
    try {
      if (currentReaction) {
        removeReactionFromPost(postId); // Frontend removal
        // Optionally: await backend call if needed
      } else {
        await reactToPostAPI(postId, "like");
      }
    } catch (error) {
      console.error("❌ Reaction failed:", error);
    }
  };

  const handleReactionClick = async (reaction: ReactionType) => {
    try {
      await reactToPostAPI(postId, reaction);
    } catch (error) {
      console.error("❌ Reaction failed:", error);
    }
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredReaction(null);
      }}
      sx={{ position: "relative", display: "inline-block" }}
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
                onClick={() => handleReactionClick(reaction.label)}
                onMouseEnter={() => setHoveredReaction(reaction.label)}
                sx={{
                  padding: 0.5,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <img src={reaction.imgSrc} alt={reaction.label} style={{ width: 30, height: 30 }} />
              </IconButton>
            </Tooltip>
          ))}
        </Paper>
      )}

      <Button
        startIcon={getReactionIcon()}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          color: currentReaction ? "#0a66c2" : theme.palette.text.secondary,
        }}
        onClick={handleMainClick}
      >
        {currentReaction ? currentReaction.charAt(0).toUpperCase() + currentReaction.slice(1) : "Like"}
      </Button>
    </Box>
  );
};

export default Reactions;
