// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography
// } from "@mui/material";

// interface DeletePostDialogProps {
//   open: boolean;
//   onClose: () => void;
//   onDelete: () => void;
// }

// const DeletePostDialog: React.FC<DeletePostDialogProps> = ({ open, onClose, onDelete }) => {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Delete post?</DialogTitle>
//       <DialogContent>
//         <Typography>
//           Are you sure you want to permanently remove this post from Ascend?
//         </Typography>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} variant="outlined">Cancel</Button>
//         <Button onClick={onDelete} variant="contained" color="error">Delete</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default DeletePostDialog;

"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

interface DeletePostDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeletePostDialog: React.FC<DeletePostDialogProps> = ({ open, onCancel, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Delete post?</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to permanently remove this post from Ascend?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined" sx={{ borderRadius: 5 }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" sx={{ borderRadius: 5 }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePostDialog;
