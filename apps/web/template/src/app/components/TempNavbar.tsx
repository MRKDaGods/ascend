"use client";
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function TempNavbar() {
  return (
    <AppBar
    position="static"
    elevation={1}
    sx={{ bgcolor: "white", // 🤍 background color
        color: "black",   // 🖤 text/icon color
        zIndex: (theme) => theme.zIndex.drawer + 1, }}
  >
    <Toolbar sx={{ minHeight: 64 }}>
      <Typography variant="h6">temporary navbar</Typography>
    </Toolbar>
  </AppBar>
  );
}
