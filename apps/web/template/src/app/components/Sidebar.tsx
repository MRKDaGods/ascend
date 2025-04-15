"use client";
import { Box, Typography, Button, Avatar, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Drawer, List, ListItem, ListItemAvatar, ListItemText,
  Badge, ListItemButton, Menu, MenuItem
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useChatStore } from "../stores/chatStore";
import { markAsRead } from "../chat/utils/api";
import { handleIncomingMessage } from "../chat/utils/fireBaseHandlers";

export type conversation = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  userId: string;
  isBlockedByPartner: boolean;
};

export default function Sidebar({ onSelectConversation }: { onSelectConversation?: (id: number) => void } = {}) {
  const conversations = useChatStore((state) => state.conversations);
  const setSelectedConversationId = useChatStore((state) => state.setSelectedConversationId);
  const setConversations = useChatStore((state) => state.setConversations);
  const unreadMessagesById = useChatStore((state) => state.unreadMessagesById);
  const markConversationAsRead = useChatStore((state) => state.markConversationAsRead);
  const markConversationAsUnread = useChatStore((state) => state.markConversationAsUnread);
  const updateLastMessage = useChatStore((state) => state.updateLastMessage);
  const appendMessageToConversation = useChatStore((state) => state.appendMessageToConversation);
  const typingStatus = useChatStore((state) => state.typingStatus);
  const setUnreadMessagesById = useChatStore((state) => state.setUnreadMessagesById);
  const selectedConversationId = useChatStore((state) => state.selectedConversationId);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuConvId, setMenuConvId] = useState<number | null>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setMenuConvId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuConvId(null);
  };

  useEffect(() => {
    axios.get("http://localhost:3001/conversations")
      .then((response) => {
        setConversations(response.data);
        response.data.forEach((chat: conversation) => {
          setUnreadMessagesById(chat.id, chat.unreadCount);
        });
      })
      .catch((e) => console.log("Error fetching conversations:", e));
  }, []);

  const handleSelectedConversation = async (id: number) => {
    if (onSelectConversation) {
      onSelectConversation(id);
    } else {
      setSelectedConversationId(id);
      markConversationAsRead(id);
      await markAsRead(id);
    }
  };

  return (
    <>
      <Drawer variant="permanent"
        sx={{
          width: { xs: 250, md: "30%" },
          maxWidth: 350,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: { xs: 250, md: "30%" },
            boxSizing: 'border-box',
            maxWidth: 350,
            paddingTop: "139px"
          },
        }}>
        <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}>
          <Typography variant="h6">Chats</Typography>
        </Box>

        {conversations.length !== 0 ? (
          <List sx={{ overflowY: "auto", maxHeight: "calc(100vh - 64px)" }}>
            {conversations.map((chat) => (
              <ListItem key={chat.id} disablePadding secondaryAction={
                <IconButton edge="end" onClick={(e) => handleMenuClick(e, chat.id)}>
                  <MoreVertIcon />
                </IconButton>
              }>
                <ListItemButton
                  selected={chat.id === selectedConversationId}
                  onClick={() => handleSelectedConversation(chat.id)}
                  sx={{ paddingY: 1.2, paddingX: 2, borderRadius: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar src={chat.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography sx={{ fontSize: 16, fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.name}</Typography>}
                    secondary={<>
                      <Typography sx={{ color: "gray", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.lastMessage}</Typography>
                      {typingStatus[chat.id] && <Typography sx={{ fontSize: "12px", color: "green" }}>typing...</Typography>}
                    </>}
                  />
                  {unreadMessagesById[chat.id] > 0 && <Badge badgeContent={unreadMessagesById[chat.id]} color="primary" />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="textSecondary">
              No chats yet
            </Typography>
          </Box>
        )}

        <Button onClick={() => {
          const testMessage = {
            id: Date.now().toString(),
            content: "🔥 Test message",
            sender: { id: "999", name: "Hamaki", profilePictureUrl: "" },
            recipient: { id: "you", name: "Ruaa", profilePictureUrl: "" },
            mediaUrls: [],
            createdAt: new Date().toISOString(),
            conversationId: 1,
            status: "delivered" as const,
          };
          console.log("Store append to convo:", testMessage.content);
          handleIncomingMessage(
            testMessage,
            selectedConversationId,
            appendMessageToConversation,
            updateLastMessage,
            setUnreadMessagesById
          );
        }}>
          Trigger Test Message
        </Button>
      </Drawer>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        {menuConvId !== null && unreadMessagesById[menuConvId] === 0 ? (
          <MenuItem
            onClick={() => {
              markConversationAsUnread(menuConvId);
              handleMenuClose();
            }}
          >
            Mark as Unread
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              if (menuConvId !== null) markConversationAsRead(menuConvId);
              handleMenuClose();
            }}
          >
            Mark as Read
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
