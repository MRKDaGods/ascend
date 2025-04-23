"use client";
import { Box, Typography, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useRouter } from "next/navigation";

const SalesNavCard = () => {
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
      <Typography fontSize={12} color="text.secondary">
        Drive larger deals with Sales Nav
      </Typography>
      <Typography fontWeight={600} fontSize={14} display="flex" alignItems="center">
        <StarIcon sx={{ fontSize: 18, color: "#F4B400", mr: 0.5 }} />
        Try for EGP0
      </Typography>
    </Box>
  );
};

export default SalesNavCard;
