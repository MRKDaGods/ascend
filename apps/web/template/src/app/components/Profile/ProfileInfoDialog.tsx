import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Profile } from "@ascend/api-client/models";
import { format as formatDate } from "date-fns";

interface ProfileInfoDialogProps {
  open: boolean;
  profile?: Profile;
  onClose: () => void;
}

export const ProfileInfoDialog = ({
  open,
  profile,
  onClose,
}: ProfileInfoDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: "1px solid action.hover" }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            About this Profile
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Profile Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Member since
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">
                {profile?.created_at
                  ? formatDate(new Date(profile.created_at), "MMMM yyyy")
                  : "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Last updated
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">
                {profile?.updated_at
                  ? formatDate(new Date(profile.updated_at), "MMMM d, yyyy")
                  : "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                User ID
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">
                {profile?.user_id || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Profile Privacy
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                {profile?.privacy || "Public"}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: "1px solid action.hover" }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: "28px",
            textTransform: "none",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
