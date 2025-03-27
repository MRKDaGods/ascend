"use client";
import React from "react";
import { List, ListItemText, Typography, Paper, ListItemButton, Box } from "@mui/material";

const sections = [
  "Account preferences",
  "Sign in & security",
  "Visibility",
  "Data privacy",
  "Advertising data",
  "Notifications",
];

export default function SettingsBar() {
  return (
    <Box>
      {/* White Top Bar with LinkedIn Branding */}
      <Box
        sx={{
          width: "100vw",
          height: "60px",
          bgcolor: "white",
          boxShadow: 1,
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          px: 3, // Adds padding on left & right
        }}
      >
        <Typography variant="h5" color="primary" fontWeight="bold">
          Linked
          <span style={{ backgroundColor: "#0077b5", color: "white", padding: "0.01em 0.2em", borderRadius: 4 }}>
            in
          </span>
        </Typography>
      </Box>

      {/* Settings Sidebar (Starts Below White Bar) */}
      <Paper
        component="nav" // Ensure the Paper is rendered as a semantic element
        elevation={3}
        sx={{
          width: "15.625em",
          p: 2,
          minHeight: "calc(100vh - 60px)",
          position: "fixed",
          top: "60px",
          left: 0,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", fontSize: "h4.fontSize", m: 1 }}>
          Settings
        </Typography>
        <List>
          {sections.map((section, index) => (
            <ListItemButton key={section} id={`settings-section-${index}`}>
              <ListItemText primary={section} primaryTypographyProps={{ fontSize: "1.1rem", fontWeight: "bold" }} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
