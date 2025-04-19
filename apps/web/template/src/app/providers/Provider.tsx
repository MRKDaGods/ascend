"use client";

import React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../theme"; // adjust path if needed
import { ApiInitializer } from "@/api";

const cache = createCache({ key: "css", prepend: true });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ApiInitializer content={() => children} />
      </ThemeProvider>
    </CacheProvider>
  );
}
