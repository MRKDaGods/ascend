"use client";

import React from "react";
import { Box, Button, Container } from "@mui/material";
import Header from "@/app/components/Header";
import AuthSection from "@/app/components/AuthSection";
import Illustration from "@/app/components/Illustration";
import { getGatewayHealth } from "@/api";

const HomePage = () => {
  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      <Header />
      <Button onClick={() => {
        console.log("test");

        getGatewayHealth().then((res) => {
          console.log("got res:", res);
        }).catch((err) => {
          console.error("gw err:", err);
        });
      }}>
        Test
      </Button>

      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 2, md: 4 },
            px: { xs: 2, md: 0 },
            mt: { xs: 2, md: 0 }
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" }, textAlign: { xs: "center", md: "left" } }}>
            <AuthSection />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "50%" }, display: "flex", justifyContent: "center", mb: { xs: -12, md: 0 } }}>
            <Illustration />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
