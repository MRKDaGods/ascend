import React from "react";
import { Box, IconButton, Typography, Stack, Button } from "@mui/material";
import { Edit, PersonAdd, TextFields, FileCopy, Delete, Add } from "@mui/icons-material";
import { useMediaStore } from "../stores/useMediaStore";

const MediaPreview: React.FC = () => {
  const { mediaFiles, mediaPreviews, removeMediaFile } = useMediaStore();

  const handleDelete = (index: number) => {
    removeMediaFile(index);
  };

  if (mediaFiles.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
      }}
    >
      {/* ✅ Left Section: Smaller Main Image Preview */}
      <Box sx={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img
          src={mediaPreviews[0]}
          alt="Main Preview"
          style={{ width: "40%", borderRadius: 8 }} // ✅ Reduced width from 85% to 70%
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 2,
            p: 1,
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            borderRadius: 2,
            width: "45%", // ✅ Slightly smaller button container
          }}
        >
          <IconButton title="Edit"><Edit /></IconButton>
          <IconButton title="Tag"><PersonAdd /></IconButton>
          <IconButton title="ALT"><TextFields /></IconButton>
        </Box>
      </Box>

      {/* ✅ Right Section: Thumbnail + Controls */}
      <Box
        sx={{
          width: "140px", // ✅ Slightly reduced width
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography fontSize="0.9rem" color="gray">
          1 of {mediaFiles.length}
        </Typography>
        <img
          src={mediaPreviews[0]}
          alt="Thumbnail"
          style={{
            width: "100%",
            borderRadius: 6,
            border: "2px solid #0073b1",
          }}
        />
        <Stack direction="row" spacing={2} mt={1}>
          <IconButton title="Duplicate"><FileCopy /></IconButton>
          <IconButton title="Delete" sx={{ color: "red" }} onClick={() => handleDelete(0)}><Delete /></IconButton>
          <IconButton title="Add More"><Add /></IconButton>
        </Stack>
      </Box>

      {/* ✅ Bottom Right: Next Button */}
      <Button
        variant="contained"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 24,
        }}
      >
        Next
      </Button>
    </Box>
  );
};

export default MediaPreview;
