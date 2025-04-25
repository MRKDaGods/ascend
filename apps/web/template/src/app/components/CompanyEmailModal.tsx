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
          fullWidth
          label="Company Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(error)}
          helperText={error}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleVerify} variant="contained" color="primary">
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyEmailModal;
