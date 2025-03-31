import Sidebar from "./components/Sidebar";
import { Box,Typography } from "@mui/material";
import ChatWindow from "./components/ChatWindow";

import TempNavbar from "./components/TempNavbar";

export default function Page(){
    return(
        <div>
   
      
        
        <Box sx={{ display: "flex", height: "100vh",flexDirection:"column",width:"100vw" }}>
          <TempNavbar/>
          <Box sx={{display: "flex", flexGrow: 1, minHeight: 0}}>
          <Sidebar /> 
          <ChatWindow />
          </Box>
          
        </Box>
      
      
       
    </div>
    );
  
   

}