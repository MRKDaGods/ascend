"use client";

import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SentConnectionRequestProps {
  open: boolean;
  onClose: () => void;
}

const SentConnectionRequest: React.FC<SentConnectionRequestProps> = ({ open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={onClose}
    >
      <Alert
        severity="success"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
        action={
          <IconButton onClick={onClose} size="small" color="inherit">
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        Connection request sent successfully.
      </Alert>
    </Snackbar>
  );
};

export default SentConnectionRequest;
