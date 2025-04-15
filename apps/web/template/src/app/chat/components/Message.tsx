"use client";
import { Box, Avatar,Paper, Typography} from "@mui/material";
import { useChatStore } from "../store/chatStore";
import React from "react";


export type messageProps = {
    id: string;
    conversationId: number;
    content: string;
    sender: {
        id: string;
        name: string;
        profilePictureUrl: string
    }
    recipient: {
        id: string;
        name: string;
        profilePictureUrl: string
    }

    mediaUrls: string[];
    createdAt: string;
    status: "sent" | "delivered" | "read";
    
}

function formatTime(isoString:string): string{
  const date = new Date(isoString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

}

export default function Message({id,content,sender,recipient,mediaUrls,createdAt,status}:messageProps){

    const conversations = useChatStore((state) => state.conversations);
    const selectedConversationId = useChatStore((state) => state.selectedConversationId);
    
    //Temporary username:
    const currentUsername = "Ruaa";
    const isSentByYou= sender.name===currentUsername;
    const conversation = conversations.find((c) => c.id === selectedConversationId);
    const isBlockedByPartner = conversation?.name === "LinkedIn User";
    const displayName = !isSentByYou && isBlockedByPartner
  ? "LinkedIn User"
  : sender.name;
   
    console.log("Message rendered", { content, sender, status, isSentByYou });
    
    
    return (
        <Box sx={{display:"flex", gap:1.5, alignItems:"flex-start", mb: 2}}>
    

<Avatar
  src={
    !isSentByYou && isBlockedByPartner
      ? ""
      : !isSentByYou
        ? conversation?.avatar
        : sender.profilePictureUrl
  }
  alt={displayName}
  sx={{ width: 50, height: 50 }}
>
  {displayName?.charAt(0) || "?"}
</Avatar>


            <Paper elevation ={0} 
        
            sx={{
              width: "fit-content",
              maxWidth: "100%", // ✅ Allow to expand fully
              p: 0.5,
              borderRadius: "8px",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
          

           { /*sender name*/ }
           <Box sx={{display:"flex", gap:1,alignItems:"center"}}>
             <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
             {displayName}
            </Typography>

            <Typography variant="caption" sx={{ color: "gray", fontWeight:"bold"}}>
                    &middot;
            </Typography>

            <Typography variant="caption" sx={{color:"gray"}}>
                
                {formatTime(createdAt)}
            </Typography>
            </Box>
            

            { /*text content*/ }
            {
                content && (
                    <Typography sx={{wordBreak:"break-word"}}>
                        {content}
                    </Typography>
                )
            }
           
           { /*media*/ }
            {
                mediaUrls.map((url,index)=>{
                    if (url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png")){
                        return(
                            <Box key={index}>
                            <img src = {url} alt="media" style={{
    maxWidth: "400px", // ✅ Responsive cap
    width: "100%",     // ✅ Stretches to parent
    height: "auto",
    borderRadius: 8,
    marginTop: 8,
  }}/>
                        </Box>
                        );   
                    } else if(url.endsWith(".mp4")|| url.endsWith(".mov")){
                        return(
                            <Box key={index}>
                                <video data-testid="video-element" src={url} controls style={{
    maxWidth: "400px",
    width: "100%",
    borderRadius: 8,
    marginTop: 8,
  }}/>
                            </Box>                        
                        );
                    } else {
                        return (
                            <Box key={index}>
                                <Typography component="a" 
                                href={url} 
                                download 
                                target="_blank" 
                                rel="noopener noreferrer"
                                sx={{
                                    color: "#1976d2",
                                    fontWeight:500,
                                    "&:hover":{
                                        textDecoration:"underline",
                                        color: "#1565c0"
                                    }
                                    
                                }}>
                                📄 Download file
                                </Typography>
                            </Box>
                        );
                    }
                })
            }

            {/* read receipts */}
            {
                isSentByYou && (
                    <Typography fontSize="0.75rem" color="gray" mt={0.5}>
                        {status === "read" ? "✔️✔️" : status === "delivered" ? "✔️" : "⏳"}
                    </Typography>
                )
            }

            </Paper>

        </Box>








    );
}

