"use client";

import Sidebar from "@/app/components/Sidebar";
import { Box, Typography } from "@mui/material";
import ChatWindow from "@/app/components/ChatWindow";
import CreateIcon from '@mui/icons-material/Create';
import TempNavbar from "@/app/components/TempNavbar";
import NewConversationDropdown from '@/app/components/NewConversationDropdown';
import { useCallback, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { api } from "@/api";
import { Message, useChatStore } from "@/app/stores/chatStore";
import { socket, handleIncomingMessage, handleIncomingMessageRead } from "@/app/utils/socketHandler";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const setLocalUser = useChatStore((state) => state.setLocalUser);

  const [loggingIn, setLoggingIn] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const appendMessageToConversation = useChatStore((state) => state.appendMessageToConversation);
  const updateLastMessage = useChatStore((state) => state.updateLastMessage);
  const setUnreadMessagesById = useChatStore((state) => state.setUnreadMessagesById);
  const selectedConversationId = useChatStore((state) => state.selectedConversationId);
  const setMessagesForConversation = useChatStore((state) => state.setMessagesForConversation);
  const messagesByConversation = useChatStore((state) => state.messagesByConversation);

  const params = useSearchParams();
  const em = params.get("em") || '';
  const pwd = params.get("pwd") || '';

  const handleIncomingMessageCallback = useCallback((data: any) =>
    handleIncomingMessage(data as Message,
      selectedConversationId,
      appendMessageToConversation,
      updateLastMessage,
      setUnreadMessagesById),
    [selectedConversationId, appendMessageToConversation, updateLastMessage, setUnreadMessagesById]);

  const handleIncomingMessageReadCallback = useCallback((conversationId: number) =>
    handleIncomingMessageRead(conversationId,
      setMessagesForConversation,
      messagesByConversation),
    [setMessagesForConversation, messagesByConversation]);

  useEffect(() => {
    api.auth.login(em, pwd).then((response) => {
      console.log("Login response:", response);

      api.user.getLocalUserProfile().then((userResponse) => {
        console.log("User profile response:", userResponse);
        setLocalUser(userResponse);

        setAuthToken(api.auth.authToken);
      }).catch((error) => {
        console.error("Error fetching user profile:", error);
        setErr(error);
      }).finally(() => setLoggingIn(false));
    })
      .catch((error) => {
        console.error("Login error:", error);
        setErr(error);
      });
  }, []);

  useEffect(() => {
    if (!authToken) {
      socket.disconnect();
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);

      // Register
      socket.emit("register", authToken);
    };

    const handleRegister = (data: any) => {
      console.log("Registered:", data);
    };

    const handleError = (data: any) => {
      //setErr(data?.message || "Unknown socket error");
    };

    socket.on("connect", handleConnect);
    socket.on("registered", handleRegister);
    socket.on("error", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("registered", handleRegister);
      socket.off("error", handleError);
      socket.disconnect();
    };
  }, [authToken]);

  // Connect to socket lma nlogin
  useEffect(() => {
    const handleMessage = (data: any) => {
      console.log("Received message:", data);
      handleIncomingMessageCallback(data);
    };

    const handleMessageRead = (data: any) => {
      handleIncomingMessageReadCallback(data.conversationId);
    };

    socket.on("message:receive", handleMessage);
    socket.on("message:read", handleMessageRead);

    return () => {
      socket.off("message:receive", handleMessage);
      socket.off("message:read", handleMessageRead);
    };
  }, [handleIncomingMessageCallback, handleIncomingMessageReadCallback]);

  const handleOpenDropdown = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  if (err) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6" color="error">
          {err}
        </Typography>
      </Box>
    );
  }

  if (loggingIn) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6">Logging in...</Typography>
      </Box>
    );
  }

  return (
    <>
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
    </>
  );
}