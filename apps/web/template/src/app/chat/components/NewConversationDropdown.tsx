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

  type connection = {
    userId: string;
    name: string;
    profilePictureUrl: string;
  };


export default function NewConversationDropdown({
    anchorEl,
    onClose,
  }: {
    anchorEl: null | HTMLElement;
    onClose: () => void;
  }){
    const open = Boolean(anchorEl);
    const [connections,setConnections]=useState<connection[]>([]);
    const {setSelectedConversationId,setConversations}=useChatStore();

    useEffect(()=>{
        if (open){
            axios
            .get("http://localhost:3001/users/connections")
            .then((res)=>setConnections(res.data))
            .catch((err)=>console.error("Failed to fetch connections", err))
        }
    },[open]);

    const handleStartConversation = async (user: connection) => {
        try {

            console.log("Clicked connection:", user.userId);
            console.log("All current conversations:", useChatStore.getState().conversations.map(c => c.userId));

          // 1. Check if conversation already exists
          const existing = useChatStore.getState().conversations.find(
            (c) => String(c.userId) === String(user.userId)
          );
      
          if (existing) {
            // Already exists, just select it
            setSelectedConversationId(existing.id);
            onClose();
            return;
          }
      
          // 2. If not, create a new conversation
          const res = await axios.post("http://localhost:3001/messages/conversations", user);
          const newConvo = res.data.data;
      
          setConversations((prev) => [newConvo, ...prev]);
          setSelectedConversationId(newConvo.id);
          onClose();
        } catch (e) {
          console.error("Failed to start conversation", e);
        }
      };
      
    return(
        <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
            {connections.map((user)=>(
                <MenuItem key={user.userId} onClick={()=>handleStartConversation(user)}>
                    <ListItemIcon>
                        <Avatar src={user.profilePictureUrl} />
                    </ListItemIcon>
                    <ListItemText primary={user.name}/>
                </MenuItem>
            ))}

        </Menu>
    )

}