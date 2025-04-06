"use client";

import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePostStore } from "../stores/usePostStore";

const DraftSavedPopup = () => {
  const { draftSavedPopupOpen, setDraftSavedPopupOpen } = usePostStore();

  const handleClose = () => {
    setDraftSavedPopupOpen(false);
  };

  return (
    <Snackbar
      open={draftSavedPopupOpen}
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
        Draft successfully saved.
      </Alert>
    </Snackbar>
  );
};

export default DraftSavedPopup;
