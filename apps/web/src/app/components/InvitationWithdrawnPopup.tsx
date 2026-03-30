// Component file: popup appears to confirm the post is UNSAVED successfully

"use client";

import { Snackbar, Alert, Link, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useConnectionStore } from "../stores/useConnectionStore";

const InvitationWithdrawnPopup = () => {
  const { InvitationWithdrawnPopupOpen, setInvitationWithdrawnPopupOpen} = useConnectionStore();

  const handleClose = () => {
    setInvitationWithdrawnPopupOpen(false);
  };

  return (
    <Snackbar
      open={InvitationWithdrawnPopupOpen}
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
        Invitation withdrawn
      </Alert>
    </Snackbar>
  );
};

export default InvitationWithdrawnPopup;
