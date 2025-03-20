"use client";
import { Box,Typography} from "@mui/material";

export default function ChatWindow(){
    return(
        <Box sx={{flexGrow: 1, height: "calc(100vh - 64px)", overflowY: "auto" }}>
        <Typography variant="h5" sx={{color:"#495057" }}>select conversation to start chatting</Typography>

    </Box>
    );
   
}

