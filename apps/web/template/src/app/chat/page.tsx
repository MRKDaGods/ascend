"use client";

import React, { useState } from "react";
import { Box, useTheme, Divider } from "@mui/material";

import Navbar from "../components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import ChatWindow from "@/app/components/ChatWindow";
import ChatSocketContainer from "../components/ChatSocketContainer";

export default function ChatPage() {
  const theme = useTheme();

  return (
    <ChatSocketContainer>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: theme.palette.background.default }}>
        <Navbar />

        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          {/* Sidebar */}
          <Sidebar />

          {/* Chat Window Section */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              bgcolor: theme.palette.background.default,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "900px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: theme.palette.background.default,
                borderLeft: `1px solid ${theme.palette.divider}`,
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
