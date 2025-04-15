
"use client";
import React from "react";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Link from 'next/link';
import SidebarPreview from "../components/SidebarPreview";

function Home() {
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
      <Navbar /> 
      <Link href="/chat">
          <button>Go to Chat</button>
      </Link>
      {/* trying akenaha fel feed */}
      <SidebarPreview />
    </Box>
  );
}

export default Home;