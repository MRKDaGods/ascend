// Component file: popup appears after creating a new post

"use client";

import { Snackbar, Alert, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePostStore } from "../stores/usePostStore";
import { useRouter } from "next/navigation";

const CopyPostPopup = () => {
  const { copyPostPopupOpen, setCopyPostPopupOpen } = usePostStore();
  const router = useRouter();

  const handleClose = () => {
    setCopyPostPopupOpen(false);
  };

  const handleViewPost = () => {
    setCopyPostPopupOpen(false);
    router.push("/feed/copypost");
  };

  return (
    <Snackbar
      open={copyPostPopupOpen}
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
              View post
            </Link>
            <IconButton onClick={handleClose} size="small" color="inherit">
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      >
        Link copied to clipboard
      </Alert>
    </Snackbar>
  );
};

export default CopyPostPopup;
