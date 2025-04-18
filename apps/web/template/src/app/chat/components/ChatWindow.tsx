"use client";
import { Box, Typography, Button, Avatar, IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/chatStore";
import axios from "axios";
import InputBox from "./InputBox";
import { socket } from "../utils/socketHandler";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
//import { socket } from "../utils/socket";
import React from "react";
import { api, extApi } from "@/api";
import MessageItem from "./MessageItem";

export default function ChatWindow() {

  //FOR THE Block MENU
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuConvId, setMenuConvId] = useState<number | null>(null);
  //worse readablioty compared to destructuring bas ahsan in avoiding unnecessary rerendering of store
  const selectedConversationId = useChatStore(state => state.selectedConversationId);
  const setMessagesForConversation = useChatStore(state => state.setMessagesForConversation);
  const conversations = useChatStore((state) => state.conversations);
  const { setSelectedConversationId, setConversations } = useChatStore.getState();

  const allMessages = useChatStore(state => state.messagesByConversation);

  const messagesByConversation = selectedConversationId ? allMessages[selectedConversationId] || [] : [];

  const resetPage = useChatStore(state => state.resetPage);
  const page = useChatStore(state => state.page);
  const setpage = useChatStore(state => state.setPage);

  //initialize bottom ref for scroll to bottom
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  //To get the conversations most recent medssages
  useEffect(() => {
    if (!selectedConversationId) return;

    //clear old pagination
    resetPage();
    setShouldScrollToBottom(true);

    // Check if this is a new conversation
    if (selectedConversationId === -1) return;

    //comment this out when testing the triggering a test msg button
    extApi.get(`messaging/conversations/${selectedConversationId}?limit=20&page=1`)
      .then((response) => {
        setMessagesForConversation(selectedConversationId!, response.data.messages.data.reverse());

        console.log("Fetched messages:", response.data.messages.data);
      })
      .catch((e) => {
        console.error("failed to fetch messages:", e);
      });
  }, [selectedConversationId]);

  //scroll to bottom
  useEffect(() => {
    if (!shouldScrollToBottom || !bottomRef.current) return;

    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [messagesByConversation.length]);


  //get older messages
  const loadOlderMessages = () => {
    const nextPage = page + 1;
    extApi
      .get(`messaging/conversations/${selectedConversationId}?limit=20&page=${nextPage}`)
      .then((res) => {
        const newMessages = res.data?.messages.data || [];
        const existingMessages = messagesByConversation;

        //check for duplicate messages
        if (
          !Array.isArray(newMessages) ||
          newMessages.length === 0 ||
          newMessages.every((msg: any) => existingMessages.some((m) => m.messageId === msg.id))
        ) {
          console.log("no more messages to load");
          return;
        }

        //else prepend older msgs to the top
        setShouldScrollToBottom(false);
        setMessagesForConversation(selectedConversationId!, (prev) =>
          [...newMessages.reverse(), ...prev]);
        setpage(nextPage);
      })
      .catch((e) => console.error("Failed to load older messages:", e));
  };


  //listen for typing event
  const typingStatus = useChatStore(state => state.typingStatus[selectedConversationId!] || false);
  const setTypingStatus = useChatStore(state => state.setTypingStatus);


  //useRef so it persists across rerenders of chat window
  const typingTimers = useRef<{ [conversationId: number]: NodeJS.Timeout }>({});

  // after implementing SOCKETS UNCOMMENT
  useEffect(() => {
    socket.on("typing", ({ conversationId }: { conversationId: number }) => {
      setTypingStatus(conversationId, true);

      //clear any existing timer
      if (typingTimers.current[conversationId]) {
        clearTimeout(typingTimers.current[conversationId]);
      }

      //set a new timer
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
    {
      return (
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="h6" sx={{ color: "#495057" }}>
            select conversation to start chatting
          </Typography>
        </Box>
      );

    }
  }

  //finding partner name
  const conversation = conversations.find((c) => c.conversationId === selectedConversationId);
  const partnerName = conversation?.otherUserFullName || "Chat";
  const isBlocked = conversation?.isBlocked;


  const handleBlock = async () => {
    try {
      if (!conversation?.otherUserId) {
        console.warn("No userId found to block.");
        return;
      }

      const res = await axios.post("http://localhost:3001/messages/block", {
        userId: conversation.otherUserId,
      });
      console.log(res.data)



      setConversations(conversations.filter((c) => c.conversationId !== selectedConversationId));
      setSelectedConversationId(null);
    } catch (e) {
      console.error("Failed to block user", e);
    }
  };

  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setMenuConvId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuConvId(null);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, paddingTop: "62px", width: "100" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // pushes name left and icon right
            alignItems: "flex-start",
            height: "100px",
            borderBottom: "2px solid #ccc",
            pl: 2,
            pr: 2,
            pt: 1,
          }}
        >
          {/* Left side: name + typing status */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: "2px", lineHeight: 1.1 }}
            >
              {partnerName}
            </Typography>

            {typingStatus && (
              <Typography variant="caption" color="gray" sx={{ mt: "2px", lineHeight: 1 }}>
                typing...
              </Typography>
            )}
          </Box>

          {/* Right side: menu icon */}
          <IconButton edge="end" onClick={(e) => handleMenuClick(e, selectedConversationId)}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* chat window header (avatar w keda) */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 1 }}>
          <Box sx={{
            borderBottom: "1px solid #ccc",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2,
            paddingX: 2,
            paddingY: 1

          }}>
            {/* TODO: shel elreplace fl deployment */}
            <Avatar
              src={conversation?.otherUserProfilePictureUrl?.replace("http://api.ascendx.tech", api.baseUrl)}
              alt={conversation?.otherUserFullName}
              sx={{ width: 95, height: 95 }}
            />
            <Typography variant="subtitle1" fontWeight="bold" >
              {partnerName}
            </Typography>
          </Box>

          {/* button to load older msgs */}
          {selectedConversationId !== -1 && (
            <Button variant="outlined" onClick={loadOlderMessages} size="small" sx={{ mb: 2 }}>
              Load older messages
            </Button>)}

          {/* render msgs iin chat window */}
          {messagesByConversation.map((msg) => (
            <MessageItem key={msg.messageId} message={msg} />
          ))}
          <Box ref={bottomRef} id="chat-bottom" />


        </Box>
        {!isBlocked ? <InputBox /> : (
          <Box sx={{ padding: 2, textAlign: "center", color: "gray" }}>
            <Typography variant="body2" fontStyle="italic">
              You can no longer message this user.
            </Typography>
          </Box>
        )}


      </Box>

      {/* block menu */}
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

