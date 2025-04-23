// LightThemeProvider.tsx
"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import React from "react";

const whiteLightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff", // paper white
      paper: "#ffffff",   // paper white
    },
    text: {
      primary: "#000000",
    },
  },
});

export default function LightThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={whiteLightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
