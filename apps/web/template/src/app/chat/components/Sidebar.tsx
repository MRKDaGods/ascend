"use client";
import { useState } from "react";
import { ListItem } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import { Drawer, Box, Typography,List,ListItemProps,Avatar,ListItemText,ListItemAvatar,Badge} from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import { useChatStore } from "../store/chatStore";

//defining conversation interface to define its structure for TS
//FIX: timestamp still not handled 
export type conversation = {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    unreadCount: number;
  }
  

export default function Sidebar(){
    
    //destructuring the state object returned from the zustand store
    const {selectedConversationId,setSelectedConversationId,conversations,setConversations}=useChatStore();
   
    //renders once when component mounts
    useEffect(()=>{
        
        
            axios.get("http://localhost:3001/conversations")
            .then((response)=>{
                setConversations(response.data);
            })
            .catch((e)=>{
                console.log("Error fetching conversations:",e);
            })
        
       
    },[])

    

    return(
        
       <Drawer variant="permanent"  
       sx={{
        width:{xs:250,md:"30%"},
        maxWidth:400,
        flexShrink:0,
        maskPosition:"fixed",
        top:"64px",
        "& .MuiDrawer-paper": 
       {
            width:{xs:250,md:"30%"},
            boxSizing: 'border-box'},
       height: "calc(100vh - 64px)",
       marginTop:"64px",
       position:"relative" 
       }}>
        <Box sx={{p:2, bgcolor:"#f5f5f5", }}>
            <Typography variant="h6">Chats</Typography>
        </Box>
        {
            conversations.length!==0? (
                <List sx={{overflowY:"auto",maxheight:"calc(100vh-64px)"}}> 
                {
                 
                 conversations.map((chat)=>(
                    <ListItem key={chat.id} disablePadding> 
                    <ListItemButton
                      selected={chat.id === selectedConversationId} 
                      onClick={() => setSelectedConversationId(chat.id)}
                      sx={{paddingY:1.2,paddingX:2,borderRadius:2}}
                    >
                      <ListItemAvatar>
                        <Avatar src={chat.avatar} />
                      </ListItemAvatar>
                      <ListItemText primary={<Typography sx={{fontSize:"16",fontWeight:"bold",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{chat.name}</Typography>}
                           secondary={<Typography sx={{color: "gray", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{chat.lastMessage}</Typography>}      
                           />


                      {chat.unreadCount > 0 && <Badge badgeContent={chat.unreadCount} color="primary" />}
                      
                    </ListItemButton>
                  </ListItem>

                 ))
                }
             </List>
            ):(
                <Box sx={{p:4, textAlign:"center"}}>
                    <Typography variant="body1" color="textSecondary">
                        No chats yet
                    </Typography>
                </Box>
            )
        }
       
       
       </Drawer>

    );

}