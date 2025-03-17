import React from "react";
import { Box } from "@mui/material";
import CreatePost from "./CreatePost";
import Post from "./Post"; // ✅ For followed users' posts
import UserPost from "./UserPost"; // ✅ For user-created posts
import { usePostStore } from "../store/usePostStore";

const Feed: React.FC = () => {
  const { posts } = usePostStore();

  return (
    <Box sx={{ width: "100%", maxWidth: 700, mx: "auto", mt: 3 }}>
      <CreatePost />

      {posts.map((post) =>
        post.username === "Ascend Developer" ? (
          <UserPost key={post.id} post={post} /> // ✅ Use `UserPost.tsx` for user-created posts
        ) : (
          <Post key={post.id} post={post} /> // ✅ Use `Post.tsx` for followed users' posts
        )
      )}
    </Box>
  );
};

export default Feed;
