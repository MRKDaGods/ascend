"use client";

import { Snackbar, Alert, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePostStore } from "../stores/usePostStore";

const UnsavePopup = () => {
  const { unsavedPopupOpen, setUnsavedPopupOpen } = usePostStore();

  const handleClose = () => {
    setUnsavedPopupOpen(false);
  };

  return (
    <Snackbar
      open={unsavedPopupOpen}
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
        Post unsaved.
      </Alert>
    </Snackbar>
  );
};

export default UnsavePopup;
