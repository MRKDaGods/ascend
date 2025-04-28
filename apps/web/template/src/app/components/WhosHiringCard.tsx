// Component file: card showing Jobs Card in feed main page

"use client";
import React from "react";
import { Card, CardActionArea, CardContent, Typography, Box, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const WhosHiringCard = () => {
  const router = useRouter();
  const theme = useTheme();

  const handleClick = () => {
    router.push("/jobs");
  };

  return (
    <Card
      sx={{
        maxWidth: 360,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <CardActionArea
        id="whos-hiring-card-button" // ✅ ID added
        onClick={handleClick}
      >
        <Box sx={{ position: "relative", width: "100%", height: 200 }}>
          <Image
            src="/hiringg.jpg"
            alt="See who's hiring"
            layout="fill"
            objectFit="cover"
            priority
          />
        </Box>
        <CardContent
          sx={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(28, 28, 28, 0.9)"
                : "rgba(255, 255, 255, 0.85)",
            padding: "8px 12px",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            See who's hiring on Ascend
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default WhosHiringCard;
