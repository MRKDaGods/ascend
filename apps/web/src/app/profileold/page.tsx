'use client';
import React from "react";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import LinkedInProfile from "../components/LinkedInProfile";


function Home() {

  return (
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
        <Navbar />
        <LinkedInProfile />
      </Box>
    );
}

export default Home;