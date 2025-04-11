'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Button,
  Box,
  Divider,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";

interface JobAlertsModalProps {
  open: boolean;
  onClose: () => void;
  topPicks: boolean;
  setTopPicks: (value: boolean) => void;
}

const JobAlertsModal = ({ open, onClose, topPicks, setTopPicks }: JobAlertsModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Manage job alerts</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 3 }}>
          <img
            src="/no-jobs.png"
            alt="No job alerts"
            style={{ width: "120px", height: "120px", marginBottom: "16px" }}
          />
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            You have no job alerts yet
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
            Turn on the job alert toggle on a job search page to create a job alert.
          </Typography>
          <Button variant="outlined">Search for jobs</Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="center" justifyContent="space-between" px={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <EmojiObjectsIcon sx={{ color: "#F4D03F" }} />
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                Top job picks for you
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Get recommended jobs based on your profile and activity.
              </Typography>
            </Box>
          </Box>
          <Switch checked={topPicks} onChange={() => setTopPicks(!topPicks)} color="success" />
        </Box>

        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose}>Back</Button>
          <Button variant="contained" onClick={onClose}>
            Done
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default JobAlertsModal;