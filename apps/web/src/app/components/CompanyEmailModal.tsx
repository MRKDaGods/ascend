"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Props {
  companyName: string;
  onClose: () => void;
  onVerify: (email: string) => void;
}

const CompanyEmailModal: React.FC<Props> = ({ companyName, onClose, onVerify }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    const domain = companyName.toLowerCase().replace(/\s/g, "") + ".com";
    if (email.endsWith(`@${domain}`)) {
      onVerify(email);
      onClose();
    } else {
      setError(`Email must end with @${domain}`);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Verify Company Email</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Please enter your company email to verify you work at <strong>{companyName}</strong>.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Company Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
          aria-label="Company Email"
          data-testid="company-email-input"
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="primary"
          data-testid="company-email-cancel-button"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleVerify} 
          color="primary" 
          variant="contained"
          data-testid="company-email-verify-button"
        >
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyEmailModal;
