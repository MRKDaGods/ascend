"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {usePostStore} from "@/app/stores/usePostStore";

interface Props {
    open: boolean;
    onClose: () => void;
    postId: number;
  }

const FeedbackDialog: React.FC<Props> = ({ open, onClose, postId }) => {
  const [reason, setReason] = React.useState("");

  const { reportPostFromAPI } = usePostStore();

  const handleSubmit = async () => {
    try {
      await reportPostFromAPI(postId, "other", reason); // use mapped reason if needed
      onClose();
    } catch (err) {
      console.error("Report failed", err);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        Don’t want to see this
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Tell us why to help improve the feed.
        </Typography>
        <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
          <FormControlLabel
            value="author"
            control={<Radio />}
            label="I'm not interested in the author"
          />
          <FormControlLabel
            value="topic"
            control={<Radio />}
            label="I've seen too many posts on this topic"
          />
          <FormControlLabel
            value="duplicate"
            control={<Radio />}
            label="I've seen this post before"
          />
          <FormControlLabel
            value="old"
            control={<Radio />}
            label="This post is old"
          />
          <FormControlLabel
            value="other"
            control={<Radio />}
            label="It's something else"
          />
        </RadioGroup>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          disabled={!reason}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;
