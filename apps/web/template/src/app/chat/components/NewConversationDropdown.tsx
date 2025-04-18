"use client";
import {
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useChatStore } from "../store/chatStore";
import { Profile } from "@ascend/api-client/models";
import { api } from "@/api";

export default function NewConversationDropdown({
  anchorEl,
  onClose,
}: {
  anchorEl: null | HTMLElement;
  onClose: () => void;
}) {
  const open = Boolean(anchorEl);
  const [connections, setConnections] = useState<Profile[]>([]);
  const { setSelectedConversationId, setConversations } = useChatStore();

  useEffect(() => {
    if (open) {
      // TODO: Fetch real connections from server
      // Emulate for now
      const connectionIds = [6, 7, 11];

      const fetchConnections = async () => {
        try {
          const profilePromises = connectionIds.map(id =>
            api.user.getUserProfile(id)
          );

          const results = await Promise.all(profilePromises);
          setConnections(results);
        } catch (error) {
          console.error("Failed to fetch connections:", error);
          setConnections([]);
        }
      };

      fetchConnections();
    }
  }, [open]);

  const handleStartConversation = async (user: Profile) => {
    try {

      console.log("Clicked connection:", user.user_id);

      const convos = useChatStore.getState().conversations;
      console.log("All current conversations", convos);

      // 1. Check if conversation already exists
      const existing = useChatStore.getState().conversations.find(
        (c) => c.otherUserId === user.user_id
      );

      if (existing) {
        console.log("Conversation already exists:", existing.conversationId);

        // Already exists, just select it
        setSelectedConversationId(existing.conversationId);
        onClose();
        return;
      }

      console.log("No existing conversation found, creating a new one.");

      // // 2. If not, create a new conversation
      setConversations((prev) => [...prev, {
        conversationId: -1,
        otherUserId: user.user_id,
        otherUserFullName: `${user.first_name} ${user.last_name}`,
        otherUserProfilePictureUrl: user.profile_picture_url,
        lastMessageContent: "",
        lastMessageTimestamp: new Date(),
        unseenMessageCount: 0,
        isBlocked: false,
      }]);

      setSelectedConversationId(-1);
      onClose();

      // const res = await axios.post("http://localhost:3001/messages/conversations", user);
      // const newConvo = res.data.data;

      // setConversations((prev) => [newConvo, ...prev]);
      
    } catch (e) {
      console.error("Failed to start conversation", e);
    }
  };

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {connections.map((user) => (
        <MenuItem key={user.user_id} onClick={() => handleStartConversation(user)}>
          <ListItemIcon>
            <Avatar src={user.profile_picture_url?.replace("http://api.ascendx.tech", api.baseUrl)} />
          </ListItemIcon>
          <ListItemText primary={`${user.first_name} ${user.last_name}`} />
        </MenuItem>
      ))}

    </Menu>
  )

}