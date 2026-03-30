"use client";

import React from "react";
import { Box } from "@mui/material";

interface MediaArrowsProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

const arrowStyle = (side: "left" | "right") => ({
  position: "absolute",
  top: "50%",
  [side]: 8,
  transform: "translateY(-50%)",
  bgcolor: "rgba(0,0,0,0.5)",
  color: "white",
  width: 32,
  height: 32,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  userSelect: "none",
  fontWeight: "bold",
  zIndex: 2,
});

const MediaArrows: React.FC<MediaArrowsProps> = ({
  currentIndex,
  total,
  onPrev,
  onNext,
}) => {
  return (
    <>
      {currentIndex > 0 && (
        <Box onClick={onPrev} sx={arrowStyle("left")}>
          {"<"}
        </Box>
      )}

      {currentIndex < total - 1 && (
        <Box onClick={onNext} sx={arrowStyle("right")}>
          {">"}
        </Box>
      )}

      {total > 1 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "rgba(0,0,0,0.6)",
            color: "white",
            px: 1.5,
            py: 0.5,
            borderRadius: "16px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            zIndex: 2,
          }}
        >
          {`${currentIndex + 1}/${total}`}
        </Box>
      )}
    </>
  );
};

export default MediaArrows;
