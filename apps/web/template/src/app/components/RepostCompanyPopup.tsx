"use client";

import { Snackbar, Alert, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePostStore } from "../stores/usePostStore";
import { useRouter } from "next/navigation";

const RepostCompanyPopup = () => {
  const {
    repostPopupOpen,
    setRepostPopupOpen,
    lastRepostType, // <- NEW: coming from Zustand
  } = usePostStore();

  const router = useRouter();

  const handleClose = () => {
    setRepostPopupOpen(false);
  };

  const handleViewPost = () => {
    setRepostPopupOpen(false);

    // Navigate based on repost type
    if (lastRepostType === "with-thoughts") {
      router.push("/feed/repostThoughts");
    } else {
      router.push("/feed/repost");
    }
    console.log("🔍 Routing to:", lastRepostType);
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

export default RepostCompanyPopup;
