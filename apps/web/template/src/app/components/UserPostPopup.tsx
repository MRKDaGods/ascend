// Component file: popup appears after creating a new post

"use client";

import { Snackbar, Alert, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePostStore } from "../stores/usePostStore";
import { useRouter } from "next/navigation";

const UserPostPopup = () => {
  const { userPostPopupOpen, setUserPostPopupOpen } = usePostStore();
  const router = useRouter();

  const handleClose = () => {
    setUserPostPopupOpen(false);
  };

  const handleViewPost = () => {
    setUserPostPopupOpen(false);
    router.push("/feed/mypost");
  };

  return (
    <Snackbar
      open={userPostPopupOpen}
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
        Post successful.
      </Alert>
    </Snackbar>
  );
};

export default UserPostPopup;
