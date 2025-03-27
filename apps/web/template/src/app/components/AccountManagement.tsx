"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { List, ListItemText, Typography, Paper, ListItemButton } from "@mui/material";

export default function AccountManagement() {
  const router = useRouter();

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Account management
      </Typography>
      <List>
        <ListItemButton id="hibernate-account-button">
          <ListItemText primary="Hibernate account" />
        </ListItemButton>
        <ListItemButton id="close-account-button" onClick={() => router.push("/CloseAccount")}>
          <ListItemText primary="Close account" />
        </ListItemButton>
      </List>
    </Paper>
  );
}
