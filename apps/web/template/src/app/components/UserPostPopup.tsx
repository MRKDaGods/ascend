"use client";
import { Snackbar, Alert, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePostStore } from "../store/usePostStore";
import { useRouter } from "next/navigation";

const UserPostPopup = () => {
  const { popupOpen, setPopupOpen } = usePostStore();
  const router = useRouter();

  const handleClose = () => {
    setPopupOpen(false);
  };

  const handleViewPost = () => {
    setPopupOpen(false);
    router.push("/mypost");
  };

  return (
    <Snackbar
      open={popupOpen}
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
