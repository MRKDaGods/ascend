import Sidebar from "./components/Sidebar";
import { Box,Typography } from "@mui/material";
import ChatWindow from "./components/ChatWindow";



export default function Page(){
    return(
        <div>
   
      
        
        <Box sx={{ display: "flex", flexGrow: 1, height: "100vh", paddingTop: "64px" }}>
          <Sidebar /> 
          <ChatWindow />
        </Box>
      
      
       
    </div>
    );
  
   

}