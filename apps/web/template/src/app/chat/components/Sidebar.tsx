"use client";
import { Box, Typography, Button, Avatar, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Drawer, List, ListItem, ListItemAvatar, ListItemText,
  Badge, ListItemButton, Menu, MenuItem
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useChatStore } from "../store/chatStore";
import { api, extApi } from "@/api";

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
  const setAllUnreadMessagesById = useChatStore((state) => state.setAllUnreadMessagesById);
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
    extApi.get("/messaging/conversations").then((response) => {
      console.log("Conversations response:", response.data);
      setConversations(response.data.conversations.data);

      // manually update unreadMessagesById
      const unreadCounts = response.data.conversations.data.reduce((acc: { [key: number]: number }, chat: any) => {
        acc[chat.conversationId] = chat.unseenMessageCount;
        return acc;
      }, {});

      setAllUnreadMessagesById(unreadCounts);
    }).catch((e) => console.log("Error fetching conversations:", e));
  }, []);

  const handleSelectedConversation = async (id: number) => {
    if (onSelectConversation) {
      onSelectConversation(id);
    } else {
      setSelectedConversationId(id);
      markConversationAsRead(id);
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

        {conversations.length > 0 ? (
          <List sx={{ overflowY: "auto", maxHeight: "calc(100vh - 64px)" }}>
            {conversations.map((chat) => (
              <ListItem key={chat.conversationId} disablePadding secondaryAction={
                <IconButton edge="end" onClick={(e) => handleMenuClick(e, chat.conversationId)}>
                  <MoreVertIcon />
                </IconButton>
              }>
                <ListItemButton
                  selected={chat.conversationId === selectedConversationId}
                  onClick={() => handleSelectedConversation(chat.conversationId)}
                  sx={{ paddingY: 1.2, paddingX: 2, borderRadius: 2 }}
                >
                  <ListItemAvatar>
                    {/* TODO: Remove elreplace lma negy ndo el actual deployment */}
                    <Avatar src={chat.otherUserProfilePictureUrl?.replace("http://api.ascendx.tech", api.baseUrl)} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography sx={{ fontSize: 16, fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.otherUserFullName}</Typography>}
                    secondary={
                      <Box component="span">
                        <Typography component="span" sx={{ color: "gray", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.lastMessageContent}</Typography>
                        {typingStatus[chat.conversationId] && <Typography component="span" sx={{ fontSize: "12px", color: "green", display: "block" }}>typing...</Typography>}
                      </Box>
                    }
                  />
                  {unreadMessagesById[chat.conversationId] > 0 && <Badge badgeContent={unreadMessagesById[chat.conversationId]} color="primary" />}
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
