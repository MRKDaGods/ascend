"use client";
import { Box,Typography,Button} from "@mui/material";
import { useEffect} from "react";
import { useChatStore } from "../store/chatStore";
import axios from "axios";

export default function ChatWindow(){

    
    //worse readablioty compared to destructuring bas ahsan in avoiding unnecessary rerendering of store
    const selectedConversationId = useChatStore(state => state.selectedConversationId);
    const setDisplayedMessages = useChatStore(state => state.setDisplayedMessages);
    const displayedMessages = useChatStore(state => state.displayedMessages);
    const resetPage = useChatStore(state => state.resetPage);
    const page= useChatStore(state=>state.page);
    const setpage = useChatStore(state=>state.setPage);

    
  

    useEffect(()=>{
        if (!selectedConversationId) return;
        
        //clear old pagination
        resetPage();

        axios.get(`http://localhost:3001/messages/${selectedConversationId}?limit=20&page=1`)
        .then((response)=>{
            setDisplayedMessages(response.data);
        })
        .catch((e)=>{
            console.error("failed to fetch messages:",e);
        });
    },[selectedConversationId]);

    const loadOlderMessages = ()=>{
        const nextPage=page+1;
        axios.get(`http://localhost:3001/messages/${selectedConversationId}?limit=20&page=${nextPage}`)
        .then((res)=>{
            if (!Array.isArray(res.data) || 
            res.data.length===0 ||
            res.data.every((msg) => displayedMessages.some((m) => m.id === msg.id))
        ) {
        
                console.log("no more messages to load");
                return;
            }
            //else prepend older msgs to the top
            setDisplayedMessages((prev)=>[...res.data,...prev]);
            setpage(nextPage);
        })
        .catch((e)=>console.error("Failed to load older messages:", e));
    };
     

    if (!selectedConversationId){
        {
            return(
                <Box sx={{flexGrow: 1, display: "flex", alignItems:"center", justifyContent:"center" }}>
                    <Typography variant="h6" sx={{color:"#495057" }}>
                        select conversation to start chatting
                    </Typography>
             </Box>
            );
            
        }
    }

   return(
    <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
    <Button variant="outlined" onClick={loadOlderMessages} size="small" sx={{mb: 2}}>
        Load older messages
    </Button>
    {displayedMessages.map((msg) => (
      msg.content ? (
        <Typography key={msg.id}>{msg.content}</Typography>
      ) : null
    ))}
  </Box>
  
   );
    
   
}

