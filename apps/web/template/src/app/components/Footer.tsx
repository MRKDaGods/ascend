import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      aria-label="Linked © 2025" // Added aria-label for accessibility
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      flexWrap="wrap"
      px={4}
      py={2}
      color="text.secondary"
      borderTop={1}
      borderColor="grey.300"
      position="absolute"
      bottom={-70}
      left={0}
      width="100%"
      height="3em" // Fixed height for the footer
      bgcolor="background.default"
      zIndex={500} // Ensures it stays above other content
    >
      <Typography variant="caption" sx={{ color: "black" }}>
        <strong>Linked</strong>
        <span style={{ backgroundColor: "black", color: "white", padding: "0.01em 0.2em", borderRadius: 4 }}>in</span> © 2025
      </Typography>
      
      <Box display="flex" gap={1.5} flexWrap="wrap">
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>User Agreement</Link>
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>Privacy Policy</Link>
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>Community Guidelines</Link>
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>Cookie Policy</Link>
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>Copyright Policy</Link>
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>Send Feedback</Link>
      </Box>
      
      <Typography variant="caption" sx={{ cursor: "pointer" }}>
        Language ⌄
      </Typography>
    </Box>
  );
};

export default Footer;
