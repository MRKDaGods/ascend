"use client";
import React from "react";
import { Box } from "@mui/material";
import ConnectionPost from "../components/ConnectionPost";
import CreatePost from "../components/CreatePost";
import { usePostStore } from "../store/usePostStore";
import Navbar from "../components/Navbar";

const Feed: React.FC = () => {
  const { posts } = usePostStore();

  const visiblePosts = posts.filter((post) => post.isUserPost !== true);

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>

        <Navbar />
        <CreatePost />
        <br></br>
        {visiblePosts.map((post) => (
            <ConnectionPost key={post.id} post={post} />
        ))}
    </Box>
  );
};

export default Feed;
