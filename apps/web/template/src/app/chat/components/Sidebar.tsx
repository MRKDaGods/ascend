"use client";
import { useState } from "react";
import { ListItem } from "@mui/material";


import { Drawer, Box, Typography,List,Avatar,ListItemText,ListItemAvatar,Badge} from "@mui/material";

//tester conversations array of objects
const staticConversations = [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      lastMessage: "Hey! How's it going?",
      unreadCount: 2,
    },
    {
      id: 2,
      name: "Bob Smith",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      lastMessage: "See you tomorrow bestieeeee!",
      unreadCount: 0,
    },
  ];


export default function Sidebar(){
    const [selectedId,setSelectedId]=useState<number | null>(null); //could be number aw null and initialy set it b null
    return(
        
       <Drawer variant="permanent"  sx={{width:{xs:250,md:"30%"},maxWidth:400,flexShrink:0,"& .MuiDrawer-paper": 
       {
            width:{xs:250,md:"30%"},
            boxSizing: 'border-box'}, }}>
        <Box sx={{p:2, bgcolor:"#f5f5f5", }}>
            <Typography variant="h6">Chats</Typography>
        </Box>
        <List>
           {
            staticConversations.map((chat)=>(
                <ListItem component="div" button key={chat.id} selected={chat.id===selectedId} onClick={()=>setSelectedId(chat.id)}>
                     <ListItemAvatar>
                            <Avatar src={chat.avatar} />
                    </ListItemAvatar>
                    <ListItemText primary={chat.name} secondary={chat.lastMessage}/>
                    {chat.unreadCount>0 && (<Badge badgeContent={chat.unreadCount} color="primary" />)}
                </ListItem>

            ))
           }
        </List>
       </Drawer>
       







    );

}