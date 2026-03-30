import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  Box,
  Button,
  Menu,
  Typography,
} from "@mui/material";
import { Profile } from "@ascend/api-client/models";

interface ContactInfoMenuProps {
  anchorEl: null | HTMLElement;
  profile?: Profile;
  isEditable: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const ContactInfoMenu = ({
  anchorEl,
  profile,
  isEditable,
  onClose,
  onEdit,
}: ContactInfoMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      PaperProps={{
        elevation: 3,
        sx: {
          minWidth: 320,
          maxWidth: 360,
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Contact Info
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <EmailIcon color="action" sx={{ mr: 2 }} />
            <Typography>
              {profile?.contact_info?.email || "No email provided"}
            </Typography>
          </Box>

          {profile?.contact_info?.phone && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PhoneIcon color="action" sx={{ mr: 2 }} />
              <Typography>
                {profile.contact_info.phone} ({profile.contact_info.phone_type})
              </Typography>
            </Box>
          )}

          {profile?.website && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LinkedInIcon color="action" sx={{ mr: 2 }} />
              <Typography
                component="a"
                href={profile?.website}
                target="_blank"
                sx={{ textDecoration: "none" }}
              >
                {profile.website}
              </Typography>
            </Box>
          )}
        </Box>

        {isEditable && (
          <Button
            variant="outlined"
            fullWidth
            size="small"
            startIcon={<EditIcon />}
            onClick={onEdit}
            sx={{
              mt: 1,
              borderRadius: "28px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Edit contact info
          </Button>
        )}
      </Box>
    </Menu>
  );
};
