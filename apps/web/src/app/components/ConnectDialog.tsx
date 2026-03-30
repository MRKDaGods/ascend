"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";

interface ConnectDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}

const ConnectDialog: React.FC<ConnectDialogProps> = ({ open, onClose, onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Send Connection Request</DialogTitle>
      <DialogContent>
        <TextField
          label="Message"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSend}>
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectDialog;
