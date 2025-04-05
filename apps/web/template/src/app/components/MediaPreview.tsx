"use client";

import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import { Delete, FileCopy, Add } from "@mui/icons-material";
import { useMediaStore } from "../stores/useMediaStore";

const MediaPreview: React.FC = () => {
  const {
    mediaFiles,
    mediaPreviews,
    removeMediaFile,
    addMediaFile,
  } = useMediaStore();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleDelete = () => {
    removeMediaFile(selectedIndex);
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleDuplicate = () => {
    const fileToDuplicate = mediaFiles[selectedIndex];
    if (fileToDuplicate) {
      const duplicated = new File([fileToDuplicate], fileToDuplicate.name, {
        type: fileToDuplicate.type,
      });
      addMediaFile(duplicated);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        addMediaFile(file);
      });
    }
  };

  if (mediaFiles.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "calc(100vh - 100px)",
        p: 2,
        overflow: "hidden", // ✅ Removes external scroller
      }}
    >
      {/* ✅ Left: Main Preview */}
      <Box
        sx={{
          width: 250,
          height: 500,
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={mediaPreviews[selectedIndex]}
          alt={`Main preview ${selectedIndex}`}
          style={{
            maxHeight: "500px",
            maxWidth: "500px",
            borderRadius: 12,
          }}
        />
      </Box>

      {/* ✅ Right: Thumbnails + Fixed Controls */}
      <Box
        sx={{
          width: 250,
          height: 500,
          display: "flex",
          flexDirection: "column",
          px: 2,
        }}
      >
        {/* ✅ Scrollable Thumbnail Grid */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            justifyItems: "center",
            alignItems: "start", // prevent row stretching
            gap: 2, // consistent spacing between rows & columns
            px: 1,
          }}
        >
          {mediaPreviews.map((preview, index) => (
            <Box key={index} sx={{ textAlign: "center" }}>
              <Box
                onClick={() => setSelectedIndex(index)}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border:
                    selectedIndex === index
                      ? "2px solid #0a66c2"
                      : "2px solid transparent",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <img
                  src={preview}
                  alt={`Thumb ${index}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: "8px",
                  }}
                />
              </Box>
              <Typography fontSize="0.75rem" sx={{ mt: 0.5 }}>
                {String(index + 1).padStart(2, "0")}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* ✅ Fixed Controls */}
        <Stack direction="row" justifyContent="space-between" mt={2}>
          <IconButton onClick={handleDuplicate}>
            <FileCopy />
          </IconButton>
          <IconButton onClick={handleDelete}>
            <Delete color="error" />
          </IconButton>
          <IconButton onClick={handleAddClick}>
            <Add />
          </IconButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={handleFileChange}
          />
        </Stack>
      </Box>

      {/* ✅ Next Button Fixed Bottom Right */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 24,
        }}
      >
        <Button variant="contained">Next</Button>
      </Box>
    </Box>
  );
};

export default MediaPreview;
