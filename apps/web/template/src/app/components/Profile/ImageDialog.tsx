import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { Profile } from "@ascend/api-client/models";

interface ImageDialogProps {
  type: "profile" | "cover" | null;
  profile?: Profile;
  onClose: () => void;
  onFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover" | "resume"
  ) => Promise<void>;
  onDeleteImage: (type: "profile" | "cover") => Promise<void>;
  isSubmitting: boolean;
  palette: any;
}

export const ImageDialog = ({
  type,
  profile,
  onClose,
  onFileUpload,
  onDeleteImage,
  isSubmitting,
  palette,
}: ImageDialogProps) => {
  if (!type) return null;
  
  return (
    <Dialog
      open={type !== null}
      onClose={onClose}
      maxWidth={type === "cover" ? "md" : "sm"}
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: palette.mode === "dark" ? "#121212" : "black",
          color: "white",
          borderRadius: "8px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "white",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          p: 2,
        }}
      >
        {type === "profile" ? "Profile Photo" : "Cover Photo"}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {type === "profile" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
              bgcolor: "#000",
              p: 3,
            }}
          >
            {profile?.profile_picture_url ? (
              <Avatar
                src={profile.profile_picture_url}
                sx={{ width: 250, height: 250 }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 250,
                  height: 250,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AddIcon sx={{ fontSize: 100, color: "white" }} />
              </Avatar>
            )}
          </Box>
        )}

        {type === "cover" && profile?.cover_photo_url && (
          <Box
            sx={{
              width: "100%",
              height: 350,
              backgroundImage: `url(${profile.cover_photo_url})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              bgcolor: "#000",
            }}
          />
        )}

        {type === "cover" && !profile?.cover_photo_url && (
          <Box
            sx={{
              width: "100%",
              height: 350,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#000",
            }}
          >
            <AddIcon sx={{ fontSize: 100, color: "action.hover" }} />
          </Box>
        )}

        <Box
          sx={{
            p: 2,
            bgcolor: "rgba(0,0,0,0.9)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <input
                accept="image/*"
                id={`${type}-upload-dialog`}
                type="file"
                hidden
                onChange={(e) => onFileUpload(e, type)}
              />
              <label htmlFor={`${type}-upload-dialog`} style={{ width: "100%" }}>
                <Button
                  variant="contained"
                  component="span"
                  fullWidth
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    textTransform: "none",
                    borderRadius: "24px",
                    py: 1,
                  }}
                  disabled={isSubmitting}
                >
                  Change {type === "profile" ? "photo" : "cover"}
                </Button>
              </label>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => onDeleteImage(type)}
                disabled={
                  isSubmitting ||
                  (type === "profile" && !profile?.profile_picture_url) ||
                  (type === "cover" && !profile?.cover_photo_url)
                }
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "#ccc",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                  textTransform: "none",
                  borderRadius: "24px",
                  py: 1,
                }}
              >
                Delete {type === "profile" ? "photo" : "cover"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
