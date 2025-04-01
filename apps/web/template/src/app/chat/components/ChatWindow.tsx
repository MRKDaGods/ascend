"use client";
import { Box,Typography,Button} from "@mui/material";
import { useEffect,useRef, useState} from "react";
import { useChatStore } from "../store/chatStore";
import axios from "axios";
import Message from "./Message";
import InputBox from "./InputBox";
import { handleIncomingMessage } from "../utils/fireBaseHandlers";


export default function ChatWindow(){

    
    //worse readablioty compared to destructuring bas ahsan in avoiding unnecessary rerendering of store
    const selectedConversationId = useChatStore(state => state.selectedConversationId);
    const setMessagesForConversation = useChatStore(state => state.setMessagesForConversation);

    const allMessages = useChatStore(state => state.messagesByConversation);

    const messagesByConversation = selectedConversationId ? allMessages[selectedConversationId] || [] : [];

    const resetPage = useChatStore(state => state.resetPage);
    const page= useChatStore(state=>state.page);
    const setpage = useChatStore(state=>state.setPage);

    //initialize bottom ref for scroll to bottom
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [shouldScrollToBottom,setShouldScrollToBottom]=useState(true);

   



  
    //To get the conversations most recent medssages
    useEffect(()=>{
        if (!selectedConversationId) return;
        
        //clear old pagination
        resetPage();
        setShouldScrollToBottom(true);

        //comment this out when testing the triggering a test msg button
        axios.get(`http://localhost:3001/messages/${selectedConversationId}?limit=20&page=1`)
        .then((response)=>{
            setMessagesForConversation(selectedConversationId!,response.data.data.messages);
        })
        .catch((e)=>{
            console.error("failed to fetch messages:",e);
        });
    },[selectedConversationId]);

    //scroll to bottom
    useEffect(() => {
        if (!shouldScrollToBottom || !bottomRef.current) return;
      
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
      }, [messagesByConversation.length]);
      

    const loadOlderMessages = ()=>{
        const nextPage=page+1;
        axios
        .get(`http://localhost:3001/messages/${selectedConversationId}?limit=20&page=${nextPage}`)
        .then((res)=>{
            const newMessages = res.data?.data?.messages || [];
            const existingMessages = messagesByConversation;

            //check for duplicate messages
            if (
              !Array.isArray(newMessages) ||
              newMessages.length === 0 ||
              newMessages.every((msg: any) => existingMessages.some((m) => m.id === msg.id))
            ) {
              console.log("no more messages to load");
              return;
            } 
            
            //else prepend older msgs to the top
            setShouldScrollToBottom(false);
            setMessagesForConversation(selectedConversationId!,(prev)=>
                [...newMessages,...prev]);
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
    <Box sx={{display:"flex", flexDirection:"column",height:"100%",minHeight:0}}>
    <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
    <Button variant="outlined" onClick={loadOlderMessages} size="small" sx={{mb: 2}}>
        Load older messages
    </Button>
    {messagesByConversation.map((msg) => (
     <Message key={msg.id} 
     id={msg.id} 
     content={msg.content} 
     sender={msg.sender} 
     mediaUrls={msg.mediaUrls} 
     createdAt={msg.createdAt} 
     conversationId={msg.conversationId}
     recipient={msg.recipient}
     status={msg.status}
     />
    ))}
    <Box ref={bottomRef} id="chat-bottom"/>
    
    
  </Box>
  <InputBox/>
  </Box>
  
   );
    
   
}

