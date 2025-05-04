"use client";

import React from "react";
import {
  List,
  ListItemText,
  Typography,
  Paper,
  ListItemButton,
  Box,
} from "@mui/material";

const sections = [
  "Account preferences",
  "Sign in & security",
  "Visibility", // ← This will show Blocked Users
  "Data privacy",
  "Advertising data",
  "Notifications",
];

interface Props {
  onSectionSelect: (section: string) => void;
  selectedSection: string;
}

export default function SettingsBar({ onSectionSelect, selectedSection }: Props) {
  return (
    <Box>
      <Box
        sx={{
          width: "100vw",
          height: "60px",
          boxShadow: 1,
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          px: 3,
        }}
      >
        <img
          src="/logoIcon.png"
          alt="Ascend"
          style={{ height: 36, borderRadius: 6 }}
        />
        <Typography variant="h5" color="primary" fontWeight="bold">
          Ascend
        </Typography>
      </Box>

      <Paper
        component="nav"
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
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", fontSize: "h4.fontSize", m: 1 }}
        >
          Settings
        </Typography>
        <List>
          {sections.map((section, index) => (
            <ListItemButton
              key={section}
              id={`settings-section-${index}`}
              selected={section === selectedSection}
              onClick={() => onSectionSelect(section)}
            >
              <ListItemText
                primary={section}
                primaryTypographyProps={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
