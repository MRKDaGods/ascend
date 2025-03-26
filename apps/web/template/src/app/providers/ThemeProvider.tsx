"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode, useEffect, useState } from "react";
import { useThemeStore } from "../stores/useThemeStore";

const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useThemeStore();
  const [muiTheme, setMuiTheme] = useState(createTheme({ palette: { mode: theme } }));

  useEffect(() => {
    // ✅ Listen for theme changes & update MUI theme dynamically
    setMuiTheme(createTheme({ palette: { mode: theme } }));
  }, [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
