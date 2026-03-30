import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Profile } from "@ascend/api-client/models";

interface ViewImageDialogProps {
  imageUrl: string | null;
  onClose: () => void;
  profile?: Profile;
  palette: any;
}

export const ViewImageDialog = ({
  imageUrl,
  onClose,
  profile,
  palette,
}: ViewImageDialogProps) => {
  if (!imageUrl) return null;

  const isProfilePicture = imageUrl === profile?.profile_picture_url;

  return (
    <Dialog
      open={imageUrl !== null}
      onClose={onClose}
      maxWidth="md"
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
        {isProfilePicture ? "Profile Photo" : "Cover Photo"}
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
          {isProfilePicture ? (
            <Avatar
              src={imageUrl}
              sx={{
                width: 300,
                height: 300,
                boxShadow: "0 0 20px rgba(255,255,255,0.2)",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100vw",
                height: 500,
                backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
