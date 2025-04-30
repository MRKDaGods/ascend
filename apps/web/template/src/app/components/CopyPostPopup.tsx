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
