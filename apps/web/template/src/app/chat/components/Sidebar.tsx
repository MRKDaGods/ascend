"use client";
import { useState } from "react";
import { ListItem } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import { Drawer, Box, Typography,List,ListItemProps,
  Avatar,ListItemText,ListItemAvatar,Badge,
  Button,IconButton} from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import { useChatStore } from "../store/chatStore";
import { markAsRead } from "../utils/api";
import { handleIncomingMessage } from "../utils/fireBaseHandlers";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

//defining conversation interface to define its structure for TS
//FIX: timestamp still not handled 
export type conversation = {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    unreadCount: number;
    userId: string;
    isBlockedByPartner: boolean;
  }



export default function Sidebar(){
    
    //destructuring the state object returned from the zustand store
    const {selectedConversationId,setSelectedConversationId,conversations,setConversations,setUnreadMessagesById,markConversationAsUnread}=useChatStore();
    const unreadMessagesById = useChatStore(state=>state.unreadMessagesById);
    const {markConversationAsRead}=useChatStore.getState();
    //handle conv selection
    const handleSelectedConversation = async (id: number)=>{
      
      setSelectedConversationId(id); //update slected conv
      markConversationAsRead(id); //locally mark as read
      await markAsRead(id); //tell BE its read
  
    }
    
    //FOR THE UNREAD MENU
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

   
    //renders once when component mounts
    useEffect(()=>{
        
        
            axios.get("http://localhost:3001/conversations")
            .then((response)=>{
                setConversations(response.data);
                response.data.forEach((chat:conversation) => {
                  setUnreadMessagesById(chat.id, chat.unreadCount);
                });
            })
            .catch((e)=>{
                console.log("Error fetching conversations:",e);
            })
        
       
    },[])

    

    return(
        <>
       <Drawer variant="permanent"  
       sx={{
        width:{xs:250,md:"30%"},
        maxWidth:350,
        flexShrink:0,
  
        "& .MuiDrawer-paper": 
       {
            width:{xs:250,md:"30%"},
            boxSizing: 'border-box',
            maxWidth: 350,
            paddingTop: "130px",
          },
           
       }}>
        {/* <Box sx={{p:2, bgcolor:"#f5f5f5", }}>
            <Typography variant="h6">Chats</Typography>
        </Box> */}
        {
            conversations.length!==0? (
                <List sx={{overflowY:"auto",maxHeight:"calc(100vh-64px)"}}> 
                {
                 
                 conversations.map((chat)=>(
                    <ListItem key={chat.id} disablePadding secondaryAction={
                      <IconButton edge="end" onClick={(e)=>handleMenuClick(e,chat.id)}>
                        <MoreVertIcon />
                      </IconButton>
                    }> 
                    <ListItemButton
                      selected={chat.id === selectedConversationId} 
                      onClick={() => {handleSelectedConversation(chat.id)}}
                      sx={{paddingY:1.2,paddingX:2,borderRadius:2}}
                    >
                      
                      <ListItemAvatar>
                        <Avatar src={chat.avatar} />
                      </ListItemAvatar>
                      <ListItemText primary={<Typography sx={{fontSize:"16",fontWeight:"bold",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{chat.name}</Typography>}
                           secondary={<Typography sx={{color: "gray", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{chat.lastMessage}</Typography>}      
                           />


                      {unreadMessagesById[chat.id] > 0 && <Badge badgeContent={unreadMessagesById[chat.id]} color="primary" />}
                      
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
       

       {/* TESTING */}
       <Button onClick={() => {
        handleIncomingMessage({
        id: Date.now().toString(), // unique fake id
        content: "🔥 Test message",
        sender: {
          id: "999",
          name: "Hamaki",
          profilePictureUrl: ""
    },
        recipient: {
      id: "you",
      name: "Ruaa",
      profilePictureUrl: ""
    },
    mediaUrls: [],
    createdAt: new Date().toISOString(),
    conversationId: 1, // <--- test with your conv ID
    status: "delivered"
  });
}}>
  Trigger Test Message
</Button>  

 
 </Drawer>


{/* read/unread menu */}
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