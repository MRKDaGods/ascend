"use client";

import Sidebar from "@/app/components/Sidebar";
import { Box } from "@mui/material";
import ChatWindow from "@/app/components/ChatWindow";
import CreateIcon from '@mui/icons-material/Create';
import TempNavbar from "@/app/components/TempNavbar";
import NewConversationDropdown from '@/app/components/NewConversationDropdown';
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import React from "react";
import ChatSocketContainer from "../components/ChatSocketContainer";

export default function Page() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenDropdown = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  return (
    <ChatSocketContainer>
      <Box sx={{ display: "flex", height: "100vh", flexDirection: "column", width: "100vw" }}>
        <TempNavbar />

        {/* spacing for UI polish */}
        <Box
          sx={{
            height: "16px",
            backgroundColor: "#f3f3f3",
            zIndex: 1302,
            position: "absolute",
            top: "64px",
            left: 0,
            width: "100%",
          }}
        />

        {/* Icon bar */}
        <Box
          sx={{
            position: "absolute",
            top: "80px",
            left: 0,
            width: "100%",
            height: "50px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            zIndex: 1301,
            px: 2,
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={handleOpenDropdown}>
            <CreateIcon />
          </IconButton>
        </Box>

        {/* Main layout */}
        <Box sx={{ display: "flex", flexGrow: 1, minHeight: 0 }}>
          <Sidebar />

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              backgroundColor: "#f5f5f5", // gray background when there's space
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "900px", // adjust as needed
                height: "100%",
                backgroundColor: "#fff", // white background for ChatWindow
              }}
            >
              <ChatWindow />
            </Box>
          </Box>
        </Box>
      </Box>

      <NewConversationDropdown anchorEl={anchorEl} onClose={handleCloseDropdown} />
    </ChatSocketContainer>
  );
}