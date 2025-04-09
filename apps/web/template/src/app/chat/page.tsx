"use client";

import Sidebar from "./components/Sidebar";
import { Box,Typography } from "@mui/material";
import ChatWindow from "./components/ChatWindow";
import CreateIcon from '@mui/icons-material/Create';
import TempNavbar from "./components/TempNavbar";
import NewConversationDropdown from './components/NewConversationDropdown';
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import React from "react";



export default function Page(){
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenDropdown = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };
    return(
      
   <>
        <Box sx={{ display: "flex", height: "100vh",flexDirection:"column",width:"100vw" }}>
          <TempNavbar/>

          {/* spacing for UI polish */}
          <Box
        sx={{
          height: "16px",
          backgroundColor: "#f3f3f3",
          zIndex: 1302, //a bit over sidebar zindex so we can go atop it
          position: "absolute",
          top: "64px",
          left: 0,
          width: "100%",
        }}
      />

      {/* Icon bar */}
        <Box
        sx={{
          position: "absolute",
          top: "80px",
          left:0,
          width: "100%",
          height: "50px",
          backgroundColor:"#fff",
          border: "1px solid #ddd",
          display:"flex",
          alignItems:"center",
          zIndex:1301,
          px:2, //(padding keft AND right)
          justifyContent: "flex-end",

        }}>
          <IconButton  onClick={handleOpenDropdown}>
            <CreateIcon />
          </IconButton>
        </Box>

          <Box sx={{display: "flex", flexGrow: 1, minHeight: 0}}>
          <Sidebar /> 
          <ChatWindow />
          </Box>
          
        </Box>
      
      
       
      <NewConversationDropdown anchorEl={anchorEl} onClose={handleCloseDropdown} />
      </>
    );
   
   

}