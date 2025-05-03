import React from "react";
import { Box, Typography, Link } from "@mui/material";

const items = [
  { title: "Hire on Ascend", subtitle: "Find, attract and recruit talent" },
  { title: "Sell with Ascend", subtitle: "Unlock sales opportunities" },
  {
    title: "Post a job for free",
    subtitle: "Get qualified applicants quickly",
  },
  {
    title: "Advertise on Ascend",
    subtitle: "Acquire customers and grow your business",
  },
  {
    title: "Elevate your small business",
    subtitle: "Find new clients and build credibility",
  },
  { title: "Learn with Ascend", subtitle: "Courses to develop your employees" },
  {
    title: "Admin Center",
    subtitle: "Manage billing and account details",
    link: "/admin",
  }, // Add link here
];

export default function ExploreMoreSection() {
  return (
    <Box minWidth={220}>
      <Typography variant="h6" gutterBottom>
        Explore more for business
      </Typography>
      {items.map((item, index) => (
        <Box key={index} mb={2}>
          <Link href={item.link || "#"} variant="subtitle1" underline="hover">
            {item.title}
          </Link>
          <Typography variant="body2" color="text.secondary">
            {item.subtitle}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
