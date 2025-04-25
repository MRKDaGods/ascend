"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode, useEffect, useState } from "react";
import { useThemeStore } from "../stores/useThemeStore";
import { PaletteMode } from "@mui/material"; // ✅ Import this type

const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useThemeStore();

  // ✅ Explicit typing for mode
  const getPalette = (): { mode: PaletteMode; background?: { default: string; paper: string } } => {
    return theme === "dark"
      ? {
          mode: "dark",
        }
      : {
          mode: "light",
          background: {
            default: "#f5f5f5", // light grey
            paper: "#ffffff",   // white cards
          },
        };
  };

  const [muiTheme, setMuiTheme] = useState(createTheme({ palette: getPalette() }));

  useEffect(() => {
    setMuiTheme(createTheme({ palette: getPalette() }));
  }, [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default CustomThemeProvider;
