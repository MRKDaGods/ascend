"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface BlockUserDialogProps {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  onBlock: () => void;
  userFullName: string;
}

const BlockUserDialog: React.FC<BlockUserDialogProps> = ({
  open,
  onClose,
  onBack,
  onBlock,
  userFullName,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h6" component="span">Block</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography fontWeight={600} gutterBottom>
          You’re about to block {userFullName}
        </Typography>
        <Typography variant="body2">
          You’ll no longer be connected, and will lose any endorsements or recommendations from this person.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", px: 3, pb: 2 }}>
        <Button onClick={onBack} variant="outlined">
          Back
        </Button>
        <Button onClick={onBlock} variant="contained" color="primary">
          Block
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlockUserDialog;
