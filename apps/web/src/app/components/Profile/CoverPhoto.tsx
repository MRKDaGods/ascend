import { Profile } from "@ascend/api-client/models";
import { Box, Typography } from "@mui/material";

interface CoverPhotoProps {
  profile?: Profile;
  isEditable: boolean;
  handleImageDialogOpen: (type: "profile" | "cover") => void;
  handleViewImage: (url: string) => void;
}

export const CoverPhoto = ({
  profile,
  isEditable,
  handleImageDialogOpen,
  handleViewImage,
}: CoverPhotoProps) => {
  return (
    <Box
      sx={{
        height: 200,
        bgcolor: "action.hover",
        backgroundImage: profile?.cover_photo_url
          ? `url(${profile.cover_photo_url})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: profile?.cover_photo_url
          ? "pointer"
          : isEditable
          ? "pointer"
          : "default",
      }}
      onClick={() => {
        if (isEditable) {
          handleImageDialogOpen("cover");
        } else if (profile?.cover_photo_url) {
          handleViewImage(profile.cover_photo_url);
        }
      }}
    >
      {isEditable && !profile?.cover_photo_url && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "text.secondary",
          }}
        >
          <Typography variant="subtitle1">
            Click to add a cover photo
          </Typography>
        </Box>
      )}
    </Box>
  );
};
