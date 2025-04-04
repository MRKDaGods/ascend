"use client";

import { Snackbar, Alert, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePostStore } from "../stores/usePostStore";
import { useRouter } from "next/navigation";

const SavePostPopup = () => {
  const { savedPopupOpen, setSavedPopupOpen } = usePostStore();
  const router = useRouter();

  const handleClose = () => {
    setSavedPopupOpen(false);
  };

  const handleViewPost = () => {
    setSavedPopupOpen(false);
    router.push("/feed/saved-post");
  };

  return (
    <Snackbar
      open={savedPopupOpen}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={handleClose}
    >
      <Alert
        severity="success"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
        action={
          <>
            <Link
              underline="hover"
              onClick={handleViewPost}
              sx={{ cursor: "pointer", color: "#0a66c2", fontWeight: "bold" }}
            >
              View saved posts
            </Link>
            <IconButton onClick={handleClose} size="small" color="inherit">
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      >
        Post saved.
      </Alert>
    </Snackbar>
  );
};

export default SavePostPopup;
