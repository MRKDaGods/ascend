"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { List, ListItemText, Typography, Paper, ListItemButton } from "@mui/material";

export default function AccountManagement() {
  const router = useRouter();

  return (
    <Paper id="account-management-page" elevation={3} sx={{ p: 2 }}>
      <Typography id="account-management-title" variant="h6" gutterBottom>
        Account management
      </Typography>
      <List id="account-management-list">
        <ListItemButton id="hibernate-account-button">
          <ListItemText id="hibernate-account-text" primary="Hibernate account" />
        </ListItemButton>
        <ListItemButton
          id="close-account-button"
          onClick={() => router.push("/authen/CloseAccount")}
        >
          <ListItemText id="close-account-text" primary="Close account" />
        </ListItemButton>
      </List>
    </Paper>
  );
}
