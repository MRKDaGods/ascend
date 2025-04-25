"use client";

import {
  Box,
  Typography,
  Avatar,
  Button,
  Stack,
  useTheme,
  Divider,
} from "@mui/material";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { useRouter } from "next/navigation";

// Dummy data (replace with backend fetch later)
const dummyInvitations = [
  {
    id: 1,
    name: "Ahmed Essam",
    location: "Giza",
    mutual: "Amr Mohamed and 5 other mutual connections",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Mujeeb Ali",
    location: "🎓 SZABIST'27 | BBA | Financial Accountant",
    mutual: "Aya Mohamed AbdelTawab and 21 other mutual connections",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 3,
    name: "Yasmine Amin",
    location: "Student at Cairo University",
    mutual: "Rowyna El-Meghalawy and 19 other mutual connections",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const InvitationsCard = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        width: "100%",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Invitations ({dummyInvitations.length})
        </Typography>

        <Typography
          variant="body2"
          onClick={() => router.push("/network/invite")}
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor: theme.palette.action.hover,
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": {
              bgcolor: theme.palette.action.selected,
            },
          }}
        >
          Show all
        </Typography>
      </Box>

      {dummyInvitations.map((invite, index) => (
        <Box key={invite.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              pb: 2,
            }}
          >
            <Avatar src={invite.avatar} sx={{ width: 48, height: 48 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography fontWeight={600}>{invite.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {invite.location}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                <Diversity3Icon sx={{ fontSize: 16 }} />
                <Typography variant="caption" color="text.secondary">
                  {invite.mutual}
                </Typography>
              </Stack>
            </Box>
            <Stack direction="row" spacing={1}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Ignore
              </Typography>
              <Button variant="outlined" size="small">
                Accept
              </Button>
            </Stack>
          </Box>
          {index < dummyInvitations.length - 1 && <Divider sx={{ mb: 2 }} />}
        </Box>
      ))}
    </Box>
  );
};

export default InvitationsCard;
