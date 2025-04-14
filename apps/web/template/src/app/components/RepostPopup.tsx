// Component file: popup appears after reposting a post

"use client";

import { Snackbar, Alert, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePostStore } from "../stores/usePostStore";
import { useRouter } from "next/navigation";

const RepostPopup = () => {
  const { repostPopupOpen, setRepostPopupOpen } = usePostStore();
  const router = useRouter();

  const handleClose = () => {
    setRepostPopupOpen(false);
  };

  const handleViewPost = () => {
    setRepostPopupOpen(false);
    router.push("/feed/mypost");
  };

  return (
    <Snackbar
      open={repostPopupOpen}
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
              View repost
            </Link>
            <IconButton onClick={handleClose} size="small" color="inherit">
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      >
        Repost successful.
      </Alert>
    </Snackbar>
  );
};

export default RepostPopup;
