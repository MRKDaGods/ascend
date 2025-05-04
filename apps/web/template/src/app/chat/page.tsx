"use client";

import Sidebar from "@/app/components/Sidebar";
import ChatWindow from "@/app/components/ChatWindow";
import Navbar from "@/app/components/Navbar";
import ChatSocketContainer from "@/app/components/ChatSocketContainer";

import { Box, useTheme } from "@mui/material";
import React from "react";

export default function Page() {
  const theme = useTheme();

  return (
    <ChatSocketContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        {/* Navbar (fixed height assumed: 64px) */}
        <Box sx={{ height: "64px", flexShrink: 0 }}>
          <Navbar />
        </Box>

        {/* Main area: Sidebar + Chat */}
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            minHeight: 0,
            overflow: "hidden", // prevents Sidebar or ChatWindow from spilling
          }}
        >
          <Sidebar />

          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: theme.palette.background.default,
              display: "flex",
              justifyContent: "center",
              alignItems: "stretch",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "900px",
                height: "100%",
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <ChatWindow />
            </Box>
          </Box>
        </Box>
      </Box>
    </ChatSocketContainer>
  );
}
