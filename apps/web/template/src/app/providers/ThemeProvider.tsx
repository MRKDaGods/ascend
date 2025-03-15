"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";
import { useClientTheme } from "../store/useThemeStore";

const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme, isClient, toggleTheme } = useClientTheme();

  // Ensure the component only renders after hydration
  if (!isClient) return null;

  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
