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
import { useEffect } from "react";
import { useConnectionStore } from "../stores/useConnectionStore";

const InvitationsCard = () => {
  const theme = useTheme();
  const router = useRouter();
  const { connections, fetchTopConnections } = useConnectionStore();

  useEffect(() => {
    fetchTopConnections(5);
  }, []);

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
          Invitations ({connections.length})
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

      {connections.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          py={3}
        >
          You have no invitations yet.
        </Typography>
      ) : (
        connections.map((conn, index) => (
          <Box key={conn.user_id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                pb: 2,
              }}
            >
              <Avatar
                src={
                  conn.profile_picture_id
                    ? `https://api.ascendx.tech/files/${conn.profile_picture_id}`
                    : undefined
                }
                sx={{ width: 48, height: 48 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight={600}>
                  {conn.first_name} {conn.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mutual connection
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                  <Diversity3Icon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary">
                    1 mutual connection
                  </Typography>
                </Stack>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: theme.palette.text.secondary,
                    cursor: "pointer",
                    border: "0px",
                  }}
                >
                  Ignore
                </Button>
                <Button variant="outlined" size="small">
                  Accept
                </Button>
              </Stack>
            </Box>
            {index < connections.length - 1 && <Divider sx={{ mb: 2 }} />}
          </Box>
        ))
      )}
    </Box>
  );
};

export default InvitationsCard;
