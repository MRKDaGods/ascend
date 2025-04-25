"use client";
import { Box, Typography, useTheme } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useRouter } from "next/navigation";

const ConnectionsRoute = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      onClick={() => router.push("/mypage")}
      sx={{
        p: 2,
        width: "100%",
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        cursor: "pointer",
        "&:hover": { boxShadow: 2 },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography fontWeight={600} fontSize={14}>Connections</Typography>
          <Typography fontSize={12} color="text.secondary">
            Grow your network
          </Typography>
        </Box>
        <PeopleAltIcon fontSize="small" />
      </Box>
    </Box>
  );
};

export default ConnectionsRoute;
