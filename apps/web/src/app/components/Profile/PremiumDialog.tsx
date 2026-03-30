import CloseIcon from "@mui/icons-material/Close";
import WorkIcon from "@mui/icons-material/Work";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

interface PremiumDialogProps {
  open: boolean;
  onClose: () => void;
}

export const PremiumDialog = ({ open, onClose }: PremiumDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: "1px solid action.hover" }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Try Premium Features
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "warning.main",
              margin: "0 auto",
              mb: 2,
            }}
          >
            <WorkIcon sx={{ fontSize: 40, color: "white" }} />
          </Avatar>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
            Upgrade to Premium
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 400, mx: "auto" }}
          >
            Get access to exclusive tools and features to boost your
            professional network and career.
          </Typography>
        </Box>

        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
          Premium features include:
        </Typography>

        <Box component="ul" sx={{ pl: 2 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography>See who viewed your profile</Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography>Advanced search filters</Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography>Direct messaging to any professional</Typography>
          </Box>
          <Box component="li">
            <Typography>Access to premium learning courses</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid action.hover" }}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "primary.main",
            borderRadius: "28px",
            textTransform: "none",
            py: 1,
            fontWeight: 600,
          }}
          onClick={onClose}
        >
          Try Premium for Free
        </Button>
      </DialogActions>
    </Dialog>
  );
};
