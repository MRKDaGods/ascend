"use client";

import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  ListItemButton,
  Menu,
  MenuItem,
  useTheme,
  ListItemIcon,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CreateIcon from "@mui/icons-material/Create";
import { useState, useEffect } from "react";
import { useChatStore } from "../stores/chatStore";
import { api, extApi } from "@/api/apiDef";
import { Profile } from "@ascend/api-client/models";

export default function Sidebar({ onSelectConversation }: { onSelectConversation?: (id: number) => void } = {}) {
  const theme = useTheme();
  const conversations = useChatStore((state) => state.conversations);
  const setSelectedConversationId = useChatStore((state) => state.setSelectedConversationId);
  const setConversations = useChatStore((state) => state.setConversations);
  const unreadMessagesById = useChatStore((state) => state.unreadMessagesById);
  const markConversationAsRead = useChatStore((state) => state.markConversationAsRead);
  const markConversationAsUnread = useChatStore((state) => state.markConversationAsUnread);
  const typingStatus = useChatStore((state) => state.typingStatus);
  const setAllUnreadMessagesById = useChatStore((state) => state.setAllUnreadMessagesById);
  const selectedConversationId = useChatStore((state) => state.selectedConversationId);
  const refreshConvos = useChatStore((state) => state.refreshConvos);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuConvId, setMenuConvId] = useState<number | null>(null);
  const [connections, setConnections] = useState<Profile[]>([]);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setMenuConvId(id);
  };

  const handleDropdownOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    fetchConnections();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuConvId(null);
  };

  const fetchConnections = async () => {
    try {
      const res = await extApi.get("connection/connections");
      setConnections(res.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  const getConversations = async () => {
    try {
      const response = await extApi.get("/messaging/conversations");
      const chats = response.data.conversations.data;
      setConversations(chats);
      const unreadCounts = chats.reduce((acc: { [key: number]: number }, chat: any) => {
        acc[chat.conversationId] = chat.unseenMessageCount;
        return acc;
      }, {});
      setAllUnreadMessagesById(unreadCounts);
    } catch (e) {
      console.log("Error fetching conversations:", e);
    }
  };

  const handleSelectedConversation = (id: number) => {
    if (onSelectConversation) {
      onSelectConversation(id);
    } else {
      setSelectedConversationId(id);
      markConversationAsRead(id);
    }
  };

  const handleStartConversation = (user: Profile) => {
    const existing = conversations.find((c) => c.otherUserId === user.user_id);
    if (existing) {
      setSelectedConversationId(existing.conversationId);
    } else {
      setConversations([
        ...conversations,
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
    setAnchorEl(null);
  };

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    if (refreshConvos) {
      getConversations().then(() => {
        setSelectedConversationId(useChatStore.getState().newConvoId);
        useChatStore.setState({ refreshConvos: false });
      });
    }
  }, [refreshConvos]);

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
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            top: "64px",
            height: "calc(100% - 64px)",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: theme.palette.background.paper,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Chats</Typography>
          <IconButton onClick={handleDropdownOpen}>
            <CreateIcon />
          </IconButton>
        </Box>

        {conversations.length > 0 ? (
          <List sx={{ overflowY: "auto", maxHeight: "calc(100vh - 64px)" }}>
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
                  onClick={() => handleSelectedConversation(chat.conversationId)}
                  sx={{
                    py: 1.2,
                    px: 2,
                    borderRadius: 2,
                    bgcolor: chat.conversationId === selectedConversationId
                      ? theme.palette.action.selected
                      : "inherit",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={chat.otherUserProfilePictureUrl?.replace("http://api.ascendx.tech", api.baseUrl)} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {chat.otherUserFullName}
                      </Typography>
                    }
                    secondary={
                      <Box component="span">
                        <Typography
                          component="span"
                          sx={{
                            color: theme.palette.text.secondary,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {chat.lastMessageContent}
                        </Typography>
                        {typingStatus[chat.conversationId] && (
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "12px",
                              color: theme.palette.success.main,
                              display: "block",
                            }}
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
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No chats yet
            </Typography>
          </Box>
        )}
      </Drawer>

      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
        {menuConvId !== null ? (
          unreadMessagesById[menuConvId] === 0 ? (
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
          )
        ) : (
          connections.map((user) => (
            <MenuItem key={user.user_id} onClick={() => handleStartConversation(user)}>
              <ListItemIcon>
                <Avatar src={user.profile_picture_url?.replace("http://api.ascendx.tech", api.baseUrl)} />
              </ListItemIcon>
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
