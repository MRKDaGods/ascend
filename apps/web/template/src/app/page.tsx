import React from "react";
import { Box, Container } from "@mui/material";
import Header from "@/app/components/Header";
import AuthSection from "@/app/components/AuthSection";
import Illustration from "@/app/components/Illustration";

const HomePage = () => {
  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      <Header />
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
