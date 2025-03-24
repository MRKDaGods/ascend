'use client';
import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "grey.100",
        color: "grey.600",
        py: 3,
        px: 2,
        mt: 4,
        textAlign: "center",
      }}
    >
      <Container>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
          {[
            "About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices",
            "Advertising", "Business Services", "Get the Ascend app", "More"
          ].map((text) => (
            <Link key={text} href="#" underline="hover" color="inherit">
              {text}
            </Link>
          ))}
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          <strong style={{ color: "#424242" }}>Asc</strong>
          <strong style={{ color: "#1E88E5" }}>end</strong> Corporation &copy; 2025
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;