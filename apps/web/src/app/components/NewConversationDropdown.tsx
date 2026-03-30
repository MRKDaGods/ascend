"use client";
import {
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useChatStore } from "../stores/chatStore";
import { Profile } from "@ascend/api-client/models";
import { api, extApi } from "@/api";

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
      extApi
        .get("connection/connections")
        .then((response) => {
          setConnections(response.data?.data?.data || []);
        })
        .catch((error) => {
          console.error("Error fetching connections:", error);
        });
    }
  }, [open]);

  const handleStartConversation = async (user: Profile) => {
    try {
      const existing = useChatStore.getState().conversations.find(
        (c) => c.otherUserId === user.user_id
      );

      if (existing) {
        setSelectedConversationId(existing.conversationId);
        onClose();
        return;
      }

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
      onClose();
    } catch (e) {
      console.error("Failed to start conversation", e);
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      container={typeof window !== "undefined" ? document.body : undefined} // ⬅️ Forces to body
      PaperProps={{
        sx: {
          zIndex: 1400, // ⬅️ Must be higher than MUI Drawer (default 1200)
        },
      }}
    >
      {connections.map((user) => (
        <MenuItem
          key={user.user_id}
          onClick={() => handleStartConversation(user)}
        >
          <ListItemIcon>
            <Avatar
              src={user.profile_picture_url?.replace(
                "http://api.ascendx.tech",
                api.baseUrl
              )}
            />
          </ListItemIcon>
          <ListItemText primary={`${user.first_name} ${user.last_name}`} />
        </MenuItem>
      ))}
    </Menu>
  );
}
