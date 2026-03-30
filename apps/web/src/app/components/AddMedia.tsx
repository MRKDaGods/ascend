// Component file: adding media bar to create post

import React from "react";
import { Button, Stack, Box } from "@mui/material";
import { Image, VideoLibrary, Article } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import MediaEditor from "./MediaEditor";
import { useMediaStore } from "../stores/useMediaStore";
import { usePostStore } from "../stores/usePostStore";

const AddMedia: React.FC = () => {
  const theme = useTheme();
  const { openEditor } = useMediaStore();
  const { setOpen } = usePostStore();

  return (
    <>
      <Box
        sx={{
          width: "100%",
          maxWidth: "700px",
          display: "flex",
          justifyContent: "center",
          padding: "8px 0",
        }}
      >
        <Stack direction="row" spacing={6} sx={{ width: "100%", justifyContent: "center" }}>
        <Button
          id="add-photo-button" // ✅ ID added
          startIcon={<Image sx={{ color: "#0073b1" }}/>} 
          onClick={() => openEditor("image")}
          sx={{ textTransform: "none", color: theme.palette.text.secondary, fontWeight: "bold" }}
        >
          Photo
        </Button>

        <Button
          id="add-video-button" // ✅ ID added
          startIcon={<VideoLibrary sx={{ color: "#228B22" }}/>} 
          onClick={() => openEditor("video")}
          sx={{ textTransform: "none", color: theme.palette.text.secondary, fontWeight: "bold"  }}
        >
          Video
        </Button>

        <Button
          id="write-article-button" // ✅ ID added
          startIcon={<Article sx={{ color: "#D9534F" }} />} 
          onClick={() => setOpen(true)}
          sx={{ textTransform: "none", color: theme.palette.text.secondary, fontWeight: "bold"  }}
        >
          Write article
        </Button>
        </Stack>
      </Box>
      <MediaEditor />
    </>
  );
};

export default AddMedia;
