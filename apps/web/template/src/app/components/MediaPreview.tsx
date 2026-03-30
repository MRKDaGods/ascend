// Component file: appears inside the MediaEditor, to preview the uploaded image/video

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
    if (mediaFiles.length >= 10) return; // ✅ Stop if already 10 media
  
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
      const filesArray = Array.from(files);
  
      if (mediaFiles.length + filesArray.length > 10) {
        const allowedFiles = filesArray.slice(0, 10 - mediaFiles.length);
        allowedFiles.forEach((file) => addMediaFile(file));
      } else {
        filesArray.forEach((file) => addMediaFile(file));
      }
    }
  };
  

  if (mediaFiles.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        width: '100%',
        height: '100%',
        gap: 2,
      }}
    >
      {/* Main Preview */}
      <Box
        sx={{
          flex: '1 1 70%',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minWidth: 0,
        }}
      >
        {mediaFiles[selectedIndex]?.type.startsWith("video") ? (
          <video
            src={mediaPreviews[selectedIndex]}
            controls
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '100%',
              borderRadius: 12,
              objectFit: "contain",
            }}
          />
        ) : (
          <img
            src={mediaPreviews[selectedIndex]}
            alt={`Main preview ${selectedIndex}`}
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '100%',
              borderRadius: 12,
              objectFit: "contain",
            }}
          />
        )}
      </Box>

      {/* Right section with fixed height and scrollable thumbnails */}
      <Box
        sx={{
          flex: '0 0 250px',
          display: "flex",
          flexDirection: "column",
          height: '100%',
        }}
      >
        {/* Scrollable thumbnails */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 1,
            p: 1,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '3px',
            },
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
               {mediaFiles[index]?.type.startsWith("video") ? (
                <video
                  src={preview}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                  muted
                />
              ) : (
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
              )}
              </Box>
              <Typography fontSize="0.75rem" sx={{ mt: 0.5 }}>
                {String(index + 1).padStart(2, "0")}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Controls */}
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{
            justifyContent: "space-between",
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 1,
          }}
        >
          <IconButton size="small" onClick={handleDuplicate}>
            <FileCopy />
          </IconButton>
          <IconButton size="small" onClick={handleDelete}>
            <Delete color="error" />
          </IconButton>
          <IconButton size="small" onClick={handleAddClick}>
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
    </Box>
  );
};

export default MediaPreview;
