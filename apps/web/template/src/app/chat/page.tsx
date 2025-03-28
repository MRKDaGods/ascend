import Sidebar from "./components/Sidebar";
import { Box,Typography } from "@mui/material";
import ChatWindow from "./components/ChatWindow";



export default function Page(){
    return(
        <div>
   
      
        
        <Box sx={{ display: "flex", height: "100vh" }}>
          <Sidebar /> 
          <ChatWindow />
        </Box>
      
      
       
    </div>
    );
  
   

}