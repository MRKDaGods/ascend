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
import { usePostStore } from "../stores/usePostStore";

type ReactionType = "Like" | "Celebrate" | "Support" | "Love" | "Idea" | "Funny";

interface Props {
  postId: number;
  liked: boolean;
  onLike: () => void;
}

const Reactions: React.FC<Props> = ({ postId, liked, onLike }) => {
  const theme = useTheme();
  const { postReactions, setReaction, clearReaction } = usePostStore();

  const [hoveredReaction, setHoveredReaction] = useState<ReactionType | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const reactions: {
    label: ReactionType;
    icon: React.ReactElement;
    imgSrc: string;
  }[] = [
    { label: "Like", icon: <img src="/reactions/like.png" alt="Like" style={{ width: 30, height: 30 }} />, imgSrc: "/reactions/like.png" },
    { label: "Celebrate", icon: <img src="/reactions/clap.png" alt="Clap" style={{ width: 30, height: 30 }} />, imgSrc: "/reactions/clap.png" },
    { label: "Support", icon: <img src="/reactions/support.png" alt="Support" style={{ width: 30, height: 30 }} />, imgSrc: "/reactions/support.png" },
    { label: "Love", icon: <img src="/reactions/love.png" alt="Love" style={{ width: 30, height: 30 }} />, imgSrc: "/reactions/love.png" },
    { label: "Idea", icon: <img src="/reactions/idea.png" alt="Idea" style={{ width: 30, height: 30 }} />, imgSrc: "/reactions/idea.png" },
    { label: "Funny", icon: <img src="/reactions/funny.png" alt="Funny" style={{ width: 30, height: 30 }} />, imgSrc: "/reactions/funny.png" },
  ];

  const currentReaction = postReactions[postId];

  const getReactionIcon = () => {
    const found = reactions.find((r) => r.label === currentReaction);
    return found ? (
      <img
        src={found.imgSrc}
        alt={currentReaction}
        style={{ width: 22, height: 22 }}
      />
    ) : (
      <ThumbUp />
    );
  };

  const handleClick = () => {
    if (hoveredReaction) {
      setReaction(postId, hoveredReaction);
    } else if (currentReaction === "Like") {
      clearReaction(postId); // remove like
    } else if (!currentReaction) {
      setReaction(postId, "Like"); // default to like
    } else {
      clearReaction(postId); // remove other reaction
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
            backgroundColor:
              theme.palette.mode === "dark" ? "#fff" : "#f9f9f9",
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
                onClick={() => {
                  setReaction(postId, reaction.label);
                }}
                onMouseEnter={() => setHoveredReaction(reaction.label)}
                sx={{
                  padding: 0.5,
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                {reaction.icon}
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
        onClick={handleClick}
      >
        {currentReaction
          ? currentReaction.charAt(0).toUpperCase() + currentReaction.slice(1)
          : "Like"}
      </Button>
    </Box>
  );
};

export default Reactions;
