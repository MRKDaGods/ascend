"use client";

import React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme"; // Import your MUI theme
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApiInitializer } from "@/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cache = createCache({ key: "css", prepend: true });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable}`}>
            <ApiInitializer content={() => children} />
          </body>
        </html>
      </ThemeProvider>
    </CacheProvider>
  );
}


