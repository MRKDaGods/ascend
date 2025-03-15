"use client";

import React from "react";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import CreatePost from "./components/CreatePost";
import Feed from "./components/Feed";

const HomePage: React.FC = () => {
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
      <Navbar />
      <CreatePost />
      <Feed />

    </Box>
  );
};

export default HomePage;
