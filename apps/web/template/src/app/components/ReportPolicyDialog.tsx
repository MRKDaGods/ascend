"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ReportPolicyDialogProps {
  open: boolean;
  onClose: () => void;
  postId: number;
  onReasonSelected: (reason: string) => void; // Add the onReasonSelected prop
}

const ReportPolicyDialog: React.FC<ReportPolicyDialogProps> = ({
  open,
  onClose,
  postId,
  onReasonSelected, // Destructure the onReasonSelected prop
}) => {
  const theme = useTheme();
  const [selectedReason, setSelectedReason] = React.useState<string | null>(null);

  // Possible reasons for reporting the post
  const reasons = [
    { label: "Harassment", value: "harassment" },
    { label: "Violence", value: "violence" },
    { label: "Hate Speech", value: "hate_speech" },
    { label: "Misinformation", value: "misinformation" },
    { label: "Other", value: "other" },
  ];

  const handleReasonClick = (reason: string) => {
    setSelectedReason(reason); // Set the selected reason
  };

  const handleNext = () => {
    if (selectedReason) {
      onReasonSelected(selectedReason); // Pass the selected reason to the parent
      onClose(); // Close the dialog
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Report Post
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="subtitle2" color="text.secondary" mb={2}>
          Select a reason for reporting:
        </Typography>

        <Box>
          <Grid container spacing={1}>
            {reasons.map((reason) => (
              <Grid item xs={6} key={reason.value}>
                <Button
                  variant={selectedReason === reason.value ? "contained" : "outlined"}
                  color={selectedReason === reason.value ? "primary" : "inherit"}
                  fullWidth
                  sx={{
                    mb: 1,
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                  }}
                  onClick={() => handleReasonClick(reason.value)}
                >
                  {reason.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleNext} color="primary" disabled={!selectedReason}>
          Next
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportPolicyDialog;