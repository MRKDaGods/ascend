"use client";
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/app/stores/chatStore";
import InputBox from "./InputBox";
import { socket } from "../utils/socketHandler";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import { api, extApi } from "@/api";
import MessageItem from "./MessageItem";

export default function ChatWindow() {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuConvId, setMenuConvId] = useState<number | null>(null);

  const selectedConversationId = useChatStore(
    (state) => state.selectedConversationId
  );
  const setMessagesForConversation = useChatStore(
    (state) => state.setMessagesForConversation
  );
  const conversations = useChatStore((state) => state.conversations);
  const { setSelectedConversationId, setConversations } =
    useChatStore.getState();
  const allMessages = useChatStore((state) => state.messagesByConversation);
  const messagesByConversation = selectedConversationId
    ? allMessages[selectedConversationId] || []
    : [];

  const resetPage = useChatStore((state) => state.resetPage);
  const page = useChatStore((state) => state.page);
  const setPage = useChatStore((state) => state.setPage);

  const typingStatus = useChatStore(
    (state) => state.typingStatus[selectedConversationId!] || false
  );
  const setTypingStatus = useChatStore((state) => state.setTypingStatus);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const typingTimers = useRef<{ [conversationId: number]: NodeJS.Timeout }>({});

  useEffect(() => {
    if (!selectedConversationId) return;
    resetPage();
    setShouldScrollToBottom(true);
    if (selectedConversationId === -1) return;

    extApi
      .get(`messaging/conversations/${selectedConversationId}?limit=20&page=1`)
      .then((response) => {
        setMessagesForConversation(
          selectedConversationId!,
          response.data.messages.data.reverse()
        );
      })
      .catch((e) => console.error("failed to fetch messages:", e));
  }, [selectedConversationId]);

  useEffect(() => {
    if (!shouldScrollToBottom || !bottomRef.current) return;
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [messagesByConversation.length]);

  const loadOlderMessages = () => {
    const nextPage = page + 1;
    extApi
      .get(
        `messaging/conversations/${selectedConversationId}?limit=20&page=${nextPage}`
      )
      .then((res) => {
        const newMessages = res.data?.messages.data || [];
        const existingMessages = messagesByConversation;
        if (
          !Array.isArray(newMessages) ||
          newMessages.length === 0 ||
          newMessages.every((msg: any) =>
            existingMessages.some((m) => m.messageId === msg.id)
          )
        ) {
          return;
        }

        setShouldScrollToBottom(false);
        setMessagesForConversation(selectedConversationId!, (prev) => [
          ...newMessages.reverse(),
          ...prev,
        ]);
        setPage(nextPage);
      })
      .catch((e) => console.error("Failed to load older messages:", e));
  };

  useEffect(() => {
    socket.on("typing", ({ conversationId }: { conversationId: number }) => {
      setTypingStatus(conversationId, true);
      if (typingTimers.current[conversationId]) {
        clearTimeout(typingTimers.current[conversationId]);
      }
      typingTimers.current[conversationId] = setTimeout(() => {
        setTypingStatus(conversationId, false);
        delete typingTimers.current[conversationId];
      }, 1000);
    });

    return () => {
      socket.off("typing");
    };
  }, []);

  if (!selectedConversationId) {
    return (
      <Box
        sx={{
          height: "calc(100vh - 64px)", // 64px navbar height
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.background.paper,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
          Select a conversation to start chatting
        </Typography>
      </Box>
    );
  }

  const conversation = conversations.find(
    (c) => c.conversationId === selectedConversationId
  );
  const partnerName = conversation?.otherUserFullName || "Chat";
  const isBlocked = conversation?.isBlocked;

  const handleBlock = async () => {
    if (!conversation?.otherUserId) return;
    try {
      await extApi.post(`connection/block/${conversation.otherUserId}`);
      setConversations(
        conversations.filter((c) => c.conversationId !== selectedConversationId)
      );
      setSelectedConversationId(null);
    } catch (e) {
      console.error("Failed to block user", e);
    }
  };

  const open = Boolean(anchorEl);
  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuConvId(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuConvId(null);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          paddingTop: "62px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            height: "100px",
            borderBottom: `2px solid ${theme.palette.divider}`,
            px: 2,
            pt: 1,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: "2px", lineHeight: 1.1 }}
            >
              {partnerName}
            </Typography>
            {typingStatus && (
              <Typography
                variant="caption"
                color={theme.palette.text.secondary}
                sx={{ mt: "2px", lineHeight: 1 }}
              >
                typing...
              </Typography>
            )}
          </Box>

          <IconButton
            edge="end"
            onClick={(e) => handleMenuClick(e, selectedConversationId)}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
              px: 2,
              py: 1,
            }}
          >
            <Avatar
              src={conversation?.otherUserProfilePictureUrl?.replace(
                "http://api.ascendx.tech",
                api.baseUrl
              )}
              alt={partnerName}
              sx={{ width: 95, height: 95 }}
            />
            <Typography variant="subtitle1" fontWeight="bold">
              {partnerName}
            </Typography>
          </Box>

          {selectedConversationId !== -1 && (
            <Button
              variant="outlined"
              onClick={loadOlderMessages}
              size="small"
              sx={{ mb: 2 }}
            >
              Load older messages
            </Button>
          )}

          {messagesByConversation.map((msg) => (
            <MessageItem key={msg.messageId} message={msg} />
          ))}
          <Box ref={bottomRef} />
        </Box>

        {!isBlocked ? (
          <InputBox />
        ) : (
          <Box
            sx={{
              padding: 2,
              textAlign: "center",
              color: theme.palette.text.disabled,
            }}
          >
            <Typography variant="body2" fontStyle="italic">
              You can no longer message this user.
            </Typography>
          </Box>
        )}
      </Box>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        {menuConvId !== null && (
          <MenuItem
            onClick={() => {
              handleBlock();
              handleMenuClose();
            }}
          >
            Block
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
