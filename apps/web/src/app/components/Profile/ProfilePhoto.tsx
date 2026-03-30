import { Avatar, Badge, Box } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { Profile } from "@ascend/api-client/models";

interface ProfilePhotoProps {
  isEditable: boolean;
  profile?: Profile;
  handleImageDialogOpen: (type: "profile" | "cover") => void;
  palette: {
    background: {
      paper: string;
    };
  };
  handleViewImage: (url: string) => void;
}

export const ProfilePhoto = ({
  isEditable,
  profile,
  handleImageDialogOpen,
  palette,
  handleViewImage,
}: ProfilePhotoProps) => {
  return (
    <Box
      sx={{
        position: "relative",
        mt: { xs: -5, sm: -7 },
        mb: { xs: 2, md: 0 },
        alignSelf: "flex-start",
      }}
    >
      {isEditable ? (
        <>
          {!profile?.profile_picture_url ? (
            <Badge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              badgeContent={
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "primary.main",
                    border: `2px solid ${palette.background.paper}`,
                  }}
                  onClick={() => handleImageDialogOpen("profile")}
                >
                  <CameraAltIcon sx={{ fontSize: 20 }} />
                </Avatar>
              }
            >
              <Avatar
                src={profile?.profile_picture_url}
                sx={{
                  width: { xs: 120, sm: 150 },
                  height: { xs: 120, sm: 150 },
                  border: `4px solid ${palette.background.paper}`,
                  boxShadow: 1,
                  cursor: "pointer",
                }}
                onClick={() => handleImageDialogOpen("profile")}
              >
                {profile?.first_name?.[0]}
              </Avatar>
            </Badge>
          ) : (
            <Avatar
              src={profile?.profile_picture_url}
              sx={{
                width: { xs: 120, sm: 150 },
                height: { xs: 120, sm: 150 },
                border: `4px solid ${palette.background.paper}`,
                boxShadow: 1,
                cursor: "pointer",
              }}
              onClick={() => handleImageDialogOpen("profile")}
            />
          )}
        </>
      ) : (
        <Avatar
          src={profile?.profile_picture_url}
          sx={{
            width: { xs: 120, sm: 150 },
            height: { xs: 120, sm: 150 },
            border: `4px solid ${palette.background.paper}`,
            boxShadow: 1,
            cursor: profile?.profile_picture_url ? "pointer" : "default",
          }}
          onClick={() =>
            profile?.profile_picture_url &&
            handleViewImage(profile.profile_picture_url)
          }
        >
          {!profile?.profile_picture_url && profile?.first_name?.[0]}
        </Avatar>
      )}
    </Box>
  );
};
