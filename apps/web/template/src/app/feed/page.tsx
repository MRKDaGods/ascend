"use client";

import React, { useEffect } from "react";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import ConnectionPost from "../components/ConnectionPost";
import CreatePost from "../components/CreatePost";
import { usePostStore } from "../stores/usePostStore";

const Feed: React.FC = () => {
  const posts = usePostStore((state) => state.posts);
  const fetchNewsFeed = usePostStore((state) => state.fetchNewsFeed);

  const visiblePosts = posts.filter((post) => post.isUserPost !== true);

  useEffect(() => {
    const fetchAndLog = async () => {
      await fetchNewsFeed();
      console.log("Loaded posts:", posts);
    };
    fetchAndLog();
  }, []);

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
      <Navbar />
      <CreatePost />
      <br />
      {visiblePosts.map((post) => (
        <ConnectionPost key={post.id} post={post} />
      ))}
    </Box>
  );
};

export default Feed;
