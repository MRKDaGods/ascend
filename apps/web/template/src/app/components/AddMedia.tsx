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
          startIcon={<Image sx={{ color: "#0073b1" }} />} 
          onClick={openEditor} 
          sx={{ textTransform: "none", color: "gray", fontWeight: "bold" }}>
            Photo
          </Button>
          <Button 
          startIcon={<VideoLibrary sx={{ color: "#228B22" }} />} 
          onClick={openEditor} 
          sx={{ textTransform: "none", color: "gray", fontWeight: "bold"  }}>
            Video
          </Button>
          <Button 
          startIcon={<Article sx={{ color: "#D9534F" }} />} 
          onClick={() => setOpen(true) }
          sx={{ textTransform: "none", color: "gray", fontWeight: "bold"  }}>
            Write article
          </Button>
        </Stack>
      </Box>
      <MediaEditor />
    </>
  );
};

export default AddMedia;
