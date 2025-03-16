import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      display="flex"
      justifyContent="center" // Centers everything
      alignItems="center"
      gap={2} // Adjusted spacing
      flexWrap="wrap"
      px={4} // Padding for spacing
      py={2} // Increased vertical padding for more space
      color="text.secondary"
      borderTop={1} // Add top border for separation
      borderColor="grey.300"
      position="absolute" // Ensure it sticks to the bottom
      bottom={0}
      left={0}
      width="100%"
      bgcolor="background.default"
    >
      {/* Left Section - LinkedIn © 2025 */}
      <Typography variant="caption" sx={{ color: "black" }}>
        <strong>Linked</strong>
        <span style={{ backgroundColor: "black", color: "white", padding: "0.01em 0.2em", borderRadius: 4 }}>in</span> © 2025
      </Typography>

      {/* Center Section - Links */}
      <Box display="flex" gap={1.5} flexWrap="wrap">
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>User Agreement</Link>
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>Privacy Policy</Link>
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>Community Guidelines</Link>
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>Cookie Policy</Link>
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>Copyright Policy</Link>
        <Link href="#" underline="hover" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>Send Feedback</Link>
      </Box>

      {/* Right Section - Language Dropdown */}
      <Typography variant="caption" sx={{ cursor: "pointer" }}>
        Language ⌄
      </Typography>
    </Box>
  );
};

export default Footer;
