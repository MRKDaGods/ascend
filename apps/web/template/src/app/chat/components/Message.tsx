"use client";
import { Box, Avatar,Paper, Typography} from "@mui/material";

export type messageProps = {
    id: string;
    content: string;
    sender: {
        id: string;
        name: string;
        profilePictureUrl: string
    }
    mediaUrls: string[];
    createdAt: string;
    currentUserName: string;
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

export default function Message({id,content,sender,mediaUrls,createdAt,currentUserName}:messageProps){
    const isSentByYou= currentUserName===sender.name; 
    return (
        <Box sx={{display:"flex", gap:1.5, alignItems:"flex-start", mb: 2}}>
            <Avatar src={sender.profilePictureUrl} alt = {sender.name} sx={{ width: 50, height: 50 }}>
            {sender.name.charAt(0)}
                </Avatar>
            <Paper elevation ={0} 
            sx={{
                p:0.5,
                // "&:hover": {
                //     bgcolor:"#f1f1f1",
                // },
                maxWidth: "70%",
                borderRadius: "8px",
                //transition: "background-color 0.2s ease"
                }}>

           { /*sender name*/ }
           <Box sx={{display:"flex", gap:1,alignItems:"center"}}>
           <Typography variant="body2" sx={{fontWeight: "bold", mb:0.5}}>
                {sender.name}
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
                            <img src = {url} alt="media" style={{maxWidth:"100%", borderRadius: 8,marginTop:8}}/>
                        </Box>
                        );   
                    } else if(url.endsWith(".mp4")|| url.endsWith(".mov")){
                        return(
                            <Box key={index}>
                                <video src={url} controls style={{maxWidth:"100%",borderRadius:8,marginTop:8}}/>
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

            </Paper>

        </Box>








    );
}

