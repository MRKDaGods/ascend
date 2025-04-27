// Component file: card showing the user's created company in feed main page

"use client";

import { Card, CardActionArea, CardContent, Typography, Box, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CompanyCard = () => {
  const router = useRouter();
  const theme = useTheme();

  const handleClick = () => {
    router.push("/CompanyPageItself");
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
        id="company-card-button" // ✅ ID added
        onClick={handleClick}
      >
        <Box sx={{ position: "relative", width: "100%", height: 200 }}>
          <Image
            src="/mycompany.jpeg"
            alt="Company Image"
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
            Company Name Here
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CompanyCard;
