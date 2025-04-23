"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { socket, handleIncomingMessage, handleIncomingMessageRead } from "../utils/socketHandler";
import { useChatStore, Message } from "@/app/stores/chatStore";
import { api } from "@/api";

export default function ChatSocketContainer({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  const [authToken, setAuthToken] = useState<string | null>(null);
  const [fetchingUserData, setFetchingUserData] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const setLocalUser = useChatStore((state) => state.setLocalUser);
  const appendMessageToConversation = useChatStore((state) => state.appendMessageToConversation);
  const updateLastMessage = useChatStore((state) => state.updateLastMessage);
  const setUnreadMessagesById = useChatStore((state) => state.setUnreadMessagesById);
  const selectedConversationId = useChatStore((state) => state.selectedConversationId);
  const setMessagesForConversation = useChatStore((state) => state.setMessagesForConversation);
  const messagesByConversation = useChatStore((state) => state.messagesByConversation);

  const handleIncomingMessageCallback = useCallback(
    (data: any) => {
      handleIncomingMessage(
        data as Message,
        selectedConversationId,
        appendMessageToConversation,
        updateLastMessage,
        setUnreadMessagesById
      );
    },
    [selectedConversationId, appendMessageToConversation, updateLastMessage, setUnreadMessagesById]
  );

  const handleIncomingMessageReadCallback = useCallback(
    (conversationId: number) => {
      handleIncomingMessageRead(
        conversationId,
        setMessagesForConversation,
        messagesByConversation
      );
    },
    [setMessagesForConversation, messagesByConversation]
  );

  useEffect(() => {
    api.user
      .getLocalUserProfile()
      .then((user) => {
        setLocalUser(user);
        setAuthToken(api.auth.authToken);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        setErr("Failed to fetch user profile.");
      })
      .finally(() => setFetchingUserData(false));
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
      socket.emit("register", authToken);
      console.log("Socket connected:", socket.id);
    };

    const handleRegister = (data: any) => {
      console.log("Socket registered:", data);
    };

    const handleError = (data: any) => {
      setErr(data?.message || "Unknown socket error");
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

  if (err) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" color="error">
          {err}
        </Typography>
      </Box>
    );
  }

  if (fetchingUserData) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: theme.palette.background.default,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Fetching user data...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
