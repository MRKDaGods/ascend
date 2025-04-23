"use client";

import {
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CreateIcon from "@mui/icons-material/Create";
import { useEffect, useState } from "react";
import { useChatStore } from "../stores/chatStore";
import { api, extApi } from "@/api/apiDef";
import { Profile } from "@ascend/api-client/models";
import type { Conversation } from "../stores/chatStore";

export default function Sidebar() {
  const theme = useTheme();

  const conversations = useChatStore((s) => s.conversations);
  const setConversations = useChatStore((s) => s.setConversations);
  const selectedConversationId = useChatStore((s) => s.selectedConversationId);
  const setSelectedConversationId = useChatStore((s) => s.setSelectedConversationId);
  const unreadMessagesById = useChatStore((s) => s.unreadMessagesById);
  const typingStatus = useChatStore((s) => s.typingStatus);
  const setAllUnreadMessagesById = useChatStore((s) => s.setAllUnreadMessagesById);
  const refreshConvos = useChatStore((s) => s.refreshConvos);
  const markConversationAsRead = useChatStore((s) => s.markConversationAsRead);
  const markConversationAsUnread = useChatStore((s) => s.markConversationAsUnread);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuConvId, setMenuConvId] = useState<number | null>(null);
  const [connections, setConnections] = useState<Profile[]>([]);
  const [dropdownAnchor, setDropdownAnchor] = useState<null | HTMLElement>(null);
  const [loadingConnections, setLoadingConnections] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setMenuAnchor(event.currentTarget);
    setMenuConvId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuConvId(null);
  };

  const handleSelect = (id: number) => {
    setSelectedConversationId(id);
    markConversationAsRead(id);
  };

  const fetchConversations = async () => {
    const response = await extApi.get("/messaging/conversations");
    const data = response.data.conversations.data;
    setConversations(data);

    const unreadMap = data.reduce((acc: Record<number, number>, chat: Conversation) => {
      acc[chat.conversationId] = chat.unseenMessageCount;
      return acc;
    }, {});
    setAllUnreadMessagesById(unreadMap);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (refreshConvos) {
      fetchConversations().then(() => {
        setSelectedConversationId(useChatStore.getState().newConvoId);
        useChatStore.setState({ refreshConvos: false });
      });
    }
  }, [refreshConvos]);

  const handleDropdownClick = (e: React.MouseEvent<HTMLElement>) => {
    setDropdownAnchor(e.currentTarget);
    setLoadingConnections(true);

    extApi
      .get("connection/connections")
      .then((res) => {
        setConnections(res.data?.data?.data || []);
      })
      .catch((err) => {
        console.error("Error fetching connections:", err);
      })
      .finally(() => setLoadingConnections(false));
  };

  const handleStartConversation = (user: Profile) => {
    const existing = conversations.find((c) => c.otherUserId === user.user_id);
    if (existing) {
      setSelectedConversationId(existing.conversationId);
    } else {
      setConversations((prev) => [
        ...prev,
        {
          conversationId: -1,
          otherUserId: user.user_id,
          otherUserFullName: `${user.first_name} ${user.last_name}`,
          otherUserProfilePictureUrl: user.profile_picture_url,
          lastMessageContent: "",
          lastMessageTimestamp: new Date(),
          unseenMessageCount: 0,
          isBlocked: false,
        },
      ]);
      setSelectedConversationId(-1);
    }

    setDropdownAnchor(null);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: { xs: 250, md: "30%" },
          maxWidth: 350,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: { xs: 250, md: "30%" },
            maxWidth: 350,
            bgcolor: theme.palette.background.default,
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box
          px={2}
          py={1.5}
          borderBottom={`1px solid ${theme.palette.divider}`}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight="bold">
            Chats
          </Typography>
          <IconButton onClick={handleDropdownClick}>
            <CreateIcon fontSize="small" />
          </IconButton>
        </Box>

        {conversations.length > 0 ? (
          <List disablePadding sx={{ overflowY: "auto", maxHeight: "calc(100vh - 110px)" }}>
            {conversations.map((chat) => (
              <ListItem
                key={chat.conversationId}
                disablePadding
                secondaryAction={
                  <IconButton edge="end" onClick={(e) => handleMenuClick(e, chat.conversationId)}>
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={chat.conversationId === selectedConversationId}
                  onClick={() => handleSelect(chat.conversationId)}
                  sx={{
                    py: 1.2,
                    px: 2,
                    borderRadius: 2,
                    transition: "background-color 0.2s",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={chat.otherUserProfilePictureUrl?.replace("http://api.ascendx.tech", api.baseUrl)}
                      sx={{ width: 42, height: 42 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography noWrap fontWeight={600} fontSize={15}>
                        {chat.otherUserFullName}
                      </Typography>
                    }
                    secondary={
                      <Box component="span" display="block">
                        <Typography
                          component="span"
                          variant="body2"
                          noWrap
                          color="text.secondary"
                          sx={{ fontSize: 13 }}
                        >
                          {chat.lastMessageContent}
                        </Typography>
                        {typingStatus[chat.conversationId] && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="success.main"
                            sx={{ fontSize: 11 }}
                          >
                            typing...
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  {unreadMessagesById[chat.conversationId] > 0 && (
                    <Badge badgeContent={unreadMessagesById[chat.conversationId]} color="primary" />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box py={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              No chats yet
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* Context Menu for existing chats */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        {menuConvId !== null &&
          (unreadMessagesById[menuConvId] === 0 ? (
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
                markConversationAsRead(menuConvId);
                handleMenuClose();
              }}
            >
              Mark as Read
            </MenuItem>
          ))}
      </Menu>

      {/* Dropdown for creating new conversation */}
      <Menu
        anchorEl={dropdownAnchor}
        open={Boolean(dropdownAnchor)}
        onClose={() => setDropdownAnchor(null)}
        PaperProps={{ sx: { minWidth: 260, borderRadius: 2 } }}
      >
        {loadingConnections ? (
          <Box px={3} py={2} display="flex" justifyContent="center">
            <CircularProgress size={20} />
          </Box>
        ) : connections.length === 0 ? (
          <Box px={3} py={2}>
            <Typography variant="body2" color="text.secondary">
              No connections found.
            </Typography>
          </Box>
        ) : (
          connections.map((user) => (
            <MenuItem key={user.user_id} onClick={() => handleStartConversation(user)}>
              <Avatar
                src={user.profile_picture_url?.replace("http://api.ascendx.tech", api.baseUrl)}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Typography variant="body2">
                {user.first_name} {user.last_name}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
